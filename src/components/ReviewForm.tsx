"use client";

import { Review } from "@/types";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextField,
  TextAreaField,
  Button,
  SelectField,
} from "@aws-amplify/ui-react";
import { useEffect } from "react";

type FormData = {
  title: string;
  rating: string;
  content: string;
};

type ReviewFormProps = {
  onSubmit: SubmitHandler<FormData>;
  review: Review | null;
  setReview: React.Dispatch<React.SetStateAction<Review | null>>;
  productId: string;
  userId: string;
};
const ReviewForm = ({ onSubmit, review, setReview }: ReviewFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      rating: "",
      content: "",
    },
  });

  useEffect(() => {
    if (review) {
      setValue("title", review.title);
      setValue("rating", review.rating.toString());
      setValue("content", review.content);
    }
  }, [review]);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <TextField
            label="Title"
            {...register("title", { required: "Title is required" })}
            hasError={!!errors.title}
            errorMessage={errors.title?.message}
          />
        </div>
        <div>
          <SelectField
            label="Rating"
            {...register("rating", { required: "Rating is required" })}
            hasError={!!errors.rating}
            errorMessage={errors.rating?.message}
            onChange={(e) => {
              const rating = parseInt(e.target.value, 10);
              setReview((prevReview) => {
                if (prevReview) {
                  return { ...prevReview, rating };
                }
                return prevReview;
              });
            }}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </SelectField>
        </div>
        <div>
          <TextAreaField
            label="Content"
            hasError={!!errors.content}
            errorMessage={errors.content?.message}
            {...register("content", { required: "Content is required" })}
          />
        </div>
        <div>
          <Button className="btn btn-blue" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};
export default ReviewForm;
