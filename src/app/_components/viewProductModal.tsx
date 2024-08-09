import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Button, ModalFooter } from '@nextui-org/react';
import { type Product } from '~/utils/data';

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ isOpen, onClose, product }) => {
  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">View Product</ModalHeader>
            <ModalBody>
              <div>
                <strong>Product Name:</strong> {product.productName}
              </div>
              <div>
                <strong>Quantity:</strong> {product.quantity}
              </div>
              <div>
                <strong>Location:</strong> {product.location}
              </div>
              <div>
                <strong>Note:</strong> {product.note}
              </div>
              {product.image && (
                <div>
                  <strong>Image:</strong>
                  <img src={product.image} alt={product.productName} style={{ width: '100%', marginTop: '10px' }} />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={onClose}>
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ViewProductModal;