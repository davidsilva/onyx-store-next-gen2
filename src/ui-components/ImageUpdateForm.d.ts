import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Image } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type ImageUpdateFormInputValues = {
    key?: string;
    alt?: string;
};
export declare type ImageUpdateFormValidationValues = {
    key?: ValidationFunction<string>;
    alt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImageUpdateFormOverridesProps = {
    ImageUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    key?: PrimitiveOverrideProps<TextFieldProps>;
    alt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ImageUpdateFormProps = React.PropsWithChildren<{
    overrides?: ImageUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    image?: Image;
    onSubmit?: (fields: ImageUpdateFormInputValues) => ImageUpdateFormInputValues;
    onSuccess?: (fields: ImageUpdateFormInputValues) => void;
    onError?: (fields: ImageUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImageUpdateFormInputValues) => ImageUpdateFormInputValues;
    onValidate?: ImageUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ImageUpdateForm(props: ImageUpdateFormProps): React.ReactElement;
