// https://github.com/naedx/amplify-playground/blob/dev/projects/copy-lambda-module-helper/README.md
// https://discord.com/channels/705853757799399426/1272718592894435340
import { BundlingOptions } from "aws-cdk-lib";
import {
  Code as LambdaCode,
  Runtime as LambdaRuntime,
} from "aws-cdk-lib/aws-lambda";
import path from "path";

import { buildSync, BuildOptions as ESBuildOptions } from "esbuild";
import fs from "fs";
import {
  ModuleKind,
  ScriptTarget,
  transpileModule,
  TranspileOptions as TSTranspileOptions,
} from "typescript";

/**
 * This utility function is used to create a lambda Code object (aliased as LambdaCode) from a local file.
 *
 * @param sourceFilePath - The path of the target file (.cjs/.js/.ts) as a string.
 * @param {AssetHelperConfig} config -  Configuration object for the asset helper.
 * @param {BuildMode} config.buildMode - The build mode to use for the lambda source file.
 *  - `Off`: no transpiling is done and the file is copied as is to the output directory.
 *  - `Typescript`: the source file will be transpiled by the TypeScript compiler.
 *  - `Esbuild`: the source file will be built and bundled by esbuild.
 * @param {BuildMode} config.ESBuildOptions - The build options for esbuild. Only used if buildMode is set to Esbuild.
 * @param {BuildMode} config.TSTranspileOptions - The build options for TypeScript transpiler. Only used if buildMode is set to Typescript.
 *
 * @returns A lambda Code object (aliased as LambdaCode)
 */

export function lambdaCodeFromAssetHelper(
  sourceFilePath: string,
  config: AssetHelperConfig
): LambdaCode {
  // The local build mode:
  //     1. receives the path of the target file (.cjs/.js/.ts) as a string.
  //     2. receives as `outputDir` directory that where Amplify will expects to find your lambda code.
  //        This directory is under .amplify/artifacts/cdk-out/
  //     3. creates the directory if it doesn't yet exist and copies your target file to it.
  //     4. throws an Exception to prevent falling back to the docker build mode. This can be disabled by
  //        commenting out the throw statement and returning false instead.
  //
  // The docker build mode (DISABLED. See above.):
  //     1. copies the file from the mapped input directory to the mapped output directory.

  if (!fs.existsSync(sourceFilePath)) {
    throw new Error(`The lambda source file does not exist: ${sourceFilePath}`);
  }

  return LambdaCode.fromAsset(path.dirname(sourceFilePath), {
    bundling: {
      image: LambdaRuntime.NODEJS_20_X.bundlingImage,
      command: [
        "node",
        "-e",
        `require('node:fs').copyFileSync("/asset-input/${path.basename(
          sourceFilePath
        )}", "/asset-output/index.cjs")`,
      ],
      local: {
        tryBundle(outputDir: string, options: BundlingOptions) {
          try {
            console.log("Local build mode");
            console.log("Writing to output directory: ", outputDir);

            // create output directory if it doesn't yet exist
            if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

            // if the source file is already js
            if (config.buildMode === BuildMode.Off) {
              fs.copyFileSync(
                sourceFilePath,
                path.resolve(outputDir, "index.js")
              );
            }
            // if choosing Typescript transpiler
            else if (config.buildMode === BuildMode.Typescript) {
              tsTranspiling(sourceFilePath, outputDir);
            }
            // if choosing ESbuild transpiler
            else if (config.buildMode === BuildMode.Esbuild) {
              esbuildBuilding(sourceFilePath, outputDir, config.esBuildOptions);
            }

            return true;
          } catch (error) {
            throw error; // throw an error to prevent falling back to the docker build mode
          }
        },
      },
    },
  });
}

interface AssetHelperConfig {
  buildMode: BuildMode;
  esBuildOptions?: ESBuildOptions;
  tsBuildOptions?: TSTranspileOptions;
}

export enum BuildMode {
  Off,
  Typescript,
  Esbuild,
}

const tsGetTranspiledCode = (
  targetModule: string,
  tsTranspileOptions: TSTranspileOptions
) => {
  const { compilerOptions, ...otherOptions } = tsTranspileOptions;

  // Transpile the source ts code into js code
  const tsSourceCode = fs.readFileSync(targetModule, "utf8");

  return transpileModule(tsSourceCode, {
    compilerOptions: {
      module: ModuleKind.CommonJS,
      target: ScriptTarget.ES2020,
      esModuleInterop: true,
      forceConsistentCasingInFileNames: true,
      strict: true,
      skipLibCheck: true,
      ...compilerOptions,
    },
    ...otherOptions,
  }).outputText;
};

const tsTranspiling = (
  targetModule: string,
  outputDir: string,
  tsTranspileOptions: TSTranspileOptions = {}
) => {
  // Transpile the source ts code into js code
  const transpiledCode = tsGetTranspiledCode(targetModule, tsTranspileOptions);

  // Write the transpiled file to the output directory
  const outputFilePath = path.join(
    outputDir,
    "index.js" //path.basename(targetModule).replace('.ts', '.js')
  );

  fs.writeFileSync(outputFilePath, transpiledCode);

  return outputFilePath;
};

const esbuildBuilding = (
  targetModule: string,
  outputDir: string,
  buildOptions: ESBuildOptions = {}
) => {
  // Build the source file with esbuild and write it to the output directory
  // as a CommonJS module

  let outputFilePath = path.join(
    outputDir,
    "index.cjs" //path.basename(targetModule).replace('.ts', '.cjs')
  );

  let buildResult = buildSync({
    platform: "node",
    bundle: true,
    outfile: outputFilePath,
    entryPoints: [targetModule],
    target: "esnext",
    format: "cjs",
    external: ["aws-lambda", "@aws-sdk/*"],
    outExtension: {
      ".js": ".cjs",
    },
    ...buildOptions,
  });

  console.log("Build result: ", buildResult);

  return outputFilePath;
};
