import { getAllReviews } from "@/apis/product.api";
import { useReviewStore } from "@/stores/useReviewStore";
import { StarFilled } from "@ant-design/icons";
import {
  Col,
  Pagination,
  PaginationProps,
  Progress,
  Row,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import PostReview from "./PostReview";
import ReviewItem from "./ReviewItem";

interface IReviewsProps {
  productId: number | string;
}

type RatingPoint = {
  level: number;
  percents: string;
};

const perPage = 3;

const Reviews: React.FunctionComponent<IReviewsProps> = ({ productId }) => {
  const reviews = useReviewStore((state) => state.reviews);
  const setReviews = useReviewStore((state) => state.setReviews);

  const [reviewRates, setReviewRates] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchReviewsData = useRef<any>(null);

  useEffect(() => {
    fetchReviewsData.current = async () => {
      try {
        const { data } = await getAllReviews(productId);
        const { reviews, ratingPoint } = data;
        setReviews(reviews);
        calculateRating(ratingPoint);
      } catch (error: any) {
        console.log(error);
      }
    };
    fetchReviewsData.current();
  }, []);

  const calculateRating = (rating: RatingPoint[]) => {
    const rates: number[] = [0, 0, 0, 0, 0];

    rating.forEach((item) => {
      rates[5 - item.level - 1] = JSON.parse(item.percents) * 100;
    });

    setReviewRates(() => [...rates]);
  };

  const onChangePage: PaginationProps["onChange"] = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Row className="mt-6" gutter={40}>
      <Col span={24}>
        <Typography.Title level={2}>Reviews</Typography.Title>
      </Col>
      <Col span={24}>
        <Row gutter={90}>
          <Col span={8}>
            <Typography.Title
              level={1}
              className="text-center"
              style={{ margin: 0, marginBottom: 40 }}
            >
              {(
                reviews
                  .map((item) => item.rating)
                  .reduce((prev, cur) => prev + cur, 0) / reviews.length
              ).toFixed(1)}
            </Typography.Title>
            <div className="flex flex-col gap-4">
              {reviewRates.map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-xl leading-none">{index + 1}</span>
                  <StarFilled className="text-2xl text-rating !leading-none" />
                  <Progress
                    percent={rate}
                    showInfo={false}
                    className="!m-0"
                    strokeColor="#F3C63FFF"
                  />
                </div>
              ))}
            </div>
          </Col>
          <Col span={16}>
            {reviews
              .slice((currentPage - 1) * perPage, currentPage * perPage)
              .map((review) => (
                <ReviewItem key={review.id} data={review} />
              ))}
            <div className="flex justify-center mb-10">
              <Pagination
                defaultCurrent={1}
                pageSize={perPage}
                total={reviews.length}
                onChange={onChangePage}
              />
            </div>
            <PostReview productId={productId} />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Reviews;
