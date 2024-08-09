"use client";
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem
} from "@nextui-org/react";
import { PlusIcon } from "../../utils/PlusIcon";
import { VerticalDotsIcon } from "../../utils/VerticalDotsIcon";
import { ChevronDownIcon } from "../../utils/ChevronDownIcon";
import { SearchIcon } from "../../utils/SearchIcon";
import { columns, locationOptions } from "../../utils/data";
import { capitalize } from "../../utils/utils";
import { Product } from "../../utils/data";
import { trpc } from "~/utils/trpc";
import { CameraIcon } from "./cameraIcon";
import AddProductModal from "./addProductModal";
import UpdateProductModal from "./updateProductModal";
import ViewProductModal from "./viewProductModal";

export const dynamic = "force-dynamic";

const locationColorMap: Record<string, ChipProps["color"]> = {
  pantry: "success",
  fridge: "danger",
  freezer: "warning",
};

const INITIAL_VISIBLE_COLUMNS = [
  "productName",
  "quantity",
  "location",
  "actions",
];

export default function App() {
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isUpdateOpen, onOpen: onUpdateOpen, onClose: onUpdateClose } = useDisclosure();
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const [backdrop, setBackdrop] = React.useState("opaque");
  const [updateProduct, setUpdateProduct] = React.useState<Product>({ id: "", productName: "", quantity: 0, location: "", image: "", note: "" });
  const [viewProduct, setViewProduct] = React.useState<Product>({ id: "", productName: "", quantity: 0, location: "", image: "", note: "" });

  const getMyProductsQuery = trpc.getMyProducts.useQuery();
  const products: Product[] = getMyProductsQuery.data ?? [];

  const deleteProductMutation = trpc.deleteProduct.useMutation();

  const addProductMutation = trpc.addProduct.useMutation();
  function addMyProduct(product: Product): void {
    addProductMutation.mutate(product, {
      onSuccess: () => {
        void getMyProductsQuery.refetch();
        onAddClose();
      },
    });
  }

  const updateProductMutation = trpc.updateProduct.useMutation();
  function updateMyProduct(product: Partial<Product> & { id: string }): void {
    updateProductMutation.mutate(product, {
      onSuccess: () => {
        void getMyProductsQuery.refetch();
        onUpdateClose();
      },
    });
  }

  const [filterValue, setFilterValue] = React.useState("");
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([]),
  );
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [locationFilter, setLocationFilter] = React.useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: "productName",
    direction: "ascending",
  });

  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid),
    );
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredProducts = products;

    if (hasSearchFilter) {
      filteredProducts = filteredProducts.filter((product) =>
        product.productName.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      locationFilter !== "all" &&
      Array.from(locationFilter).length !== locationOptions.length
    ) {
      filteredProducts = filteredProducts.filter((product) =>
        Array.from(locationFilter).includes(product.location),
      );
    }

    return filteredProducts;
  }, [products, filterValue, locationFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: Product, b: Product) => {
      const first = a[sortDescriptor.column as keyof Product] as string;
      const second = b[sortDescriptor.column as keyof Product] as string;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback(
    (product: Product, columnKey: React.Key) => {
      const cellValue = product[columnKey as keyof Product];

      switch (columnKey) {
        case "productName":
          return (
            <User
              avatarProps={{ radius: "lg", src: product.image }}
              description={product.note}
              name={cellValue}
            >
              {product.note}
            </User>
          );
        case "quantity":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{cellValue}</p>
            </div>
          );
        case "location":
          return (
            <Chip
              className="capitalize"
              color={locationColorMap[product.location]}
              size="sm"
              variant="flat"
            >
              {cellValue}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem onClick={() => { setViewProduct(product); onViewOpen(); }}>View</DropdownItem>
                  <DropdownItem onClick={() => { setUpdateProduct(product); onUpdateOpen(); }}>Update</DropdownItem>
                  <DropdownItem onClick={() => {deleteProductMutation.mutate({ id: product.id }); void getMyProductsQuery.refetch();}}>Delete</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [],
  );

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    [],
  );

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by product name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Location
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={locationFilter}
                selectionMode="multiple"
                onSelectionChange={setLocationFilter}
              >
                {locationOptions.map((location) => (
                  <DropdownItem key={location.uid} className="capitalize">
                    {capitalize(location.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />} onClick={() => { setBackdrop(backdrop); onAddOpen(); }}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {products.length} products
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    locationFilter,
    visibleColumns,
    onSearchChange,
    onRowsPerPageChange,
    products,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between px-2 py-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === "all"
            ? "All items selected"
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  return (
    <div>
      <Table
        aria-label="Pantry Products Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[382px]",
        }}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No products found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <AddProductModal isOpen={isAddOpen} onClose={onAddClose} locationOptions={locationOptions} onSubmit={addMyProduct} />
      <UpdateProductModal isOpen={isUpdateOpen} onClose={onUpdateClose} locationOptions={locationOptions} updateProduct={updateProduct} onSubmit={updateMyProduct} />
      <ViewProductModal isOpen={isViewOpen} onClose={onViewClose} product={viewProduct} />
    </div>
  );
}
