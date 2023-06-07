import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row, Spin, Typography } from "antd";
import SummaryCard from "./components/SummaryCard";
import ProductTable from "./components/ProductTable";
import { getAllProducts } from "@/apis/product.api";
import AddProductModal from "./components/AddProductModal";
import { useAppStore } from "@/stores/useAppStore";
import { useProductStore } from "@/stores/useProductStore";
import { useCategoriesStore } from "@/stores/useCategoryStore";
import { getAllCategories } from "@/apis/category.api";

const ProductManagementPage: React.FunctionComponent = () => {
  const [show, setShow] = useState<boolean>(false);
  const fetchProductData = useRef<any>(null);

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);
  const categories = useCategoriesStore((state) => state.categories);
  const setCategories = useCategoriesStore((state) => state.setCategories);

  useEffect(() => {
    fetchProductData.current = async () => {
      setIsLoading(true);
      try {
        const { data: productData } = await getAllProducts();
        const { data: categoryData } = await getAllCategories();

        setProducts(productData);
        setCategories(categoryData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    };
    fetchProductData.current();
  }, []);

  return (
    <div className="p-8">
      {/* TITlE */}
      <Row justify={"space-between"} align={"middle"}>
        <Col>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Product management
          </Typography.Title>
        </Col>
        <Col>
          <Button
            type="primary"
            className="bg-primary"
            size="large"
            onClick={() => setShow(true)}
          >
            Add new product
          </Button>
        </Col>
      </Row>

      {/* SUMMARY CARD */}
      <div className="p-5 mt-5 mb-12 rounded-lg bg-primary-100">
        <span className="text-xl">Summary</span>
        <Row justify={"space-between"} className="px-10 py-5">
          <Col span={6}>
            <SummaryCard
              title="Total products"
              value={products.length}
              percentage={5.39}
            />
          </Col>
          <Col span={6}>
            <SummaryCard
              title="Total Sum"
              value={`${new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(
                products
                  ? products
                      .map(
                        (item) =>
                          JSON.parse(item.price as string) * item.inventory
                      )
                      .reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue,
                        0
                      )
                  : 0
              )}`}
              percentage={22}
            />
          </Col>
          <Col span={6}>
            <SummaryCard
              title="Number of categories"
              value={categories.length}
              percentage={67}
            />
          </Col>
        </Row>
      </div>

      {/* TABLE */}
      {!isLoading ? (
        <ProductTable />
      ) : (
        <div className="flex justify-center w-full">
          <Spin spinning={isLoading} size="large" />
        </div>
      )}

      <AddProductModal show={show} setShow={setShow} />
    </div>
  );
};

export default ProductManagementPage;
