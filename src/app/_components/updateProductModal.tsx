import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Select, SelectItem, Button, ModalFooter } from '@nextui-org/react';
import { CameraIcon } from './icons';
import { type Product } from '~/utils/data';
import { useUploadThing } from '~/utils/uploadthing';

interface UpdateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationOptions: Array<{ uid: string, name: string }>;
  updateProduct: Product;
  onSubmit: (product: Product) => void;
}

const UpdateProductModal: React.FC<UpdateProductModalProps> = ({ isOpen, onClose, locationOptions, updateProduct, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: updateProduct.productName,
    quantity: updateProduct.quantity?.toString(),
    location: updateProduct.location,
    note: updateProduct.note,
    image: updateProduct.image,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const { startUpload } = useUploadThing('imageUploader', {
    onUploadError: () => {
      alert('Error occurred while uploading product image.');
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    let imageUrl = formData.image;
    if (selectedFile) {
      const uploadResult = await startUpload([selectedFile]);
      if (uploadResult && uploadResult.length > 0 && uploadResult[0]?.url) {
        imageUrl = uploadResult[0].url;
      }
    }

    onSubmit({
      id: updateProduct.id,
      productName: formData.productName,
      quantity: parseInt(formData.quantity),
      location: formData.location,
      note: formData.note,
      image: imageUrl,
    });

    setIsLoading(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        productName: '',
        quantity: '',
        location: '',
        note: '',
        image: '',
      });
      setSelectedFile(null);
      setFileName('');
    } else if (isOpen) {
      setFormData({
        productName: updateProduct.productName,
        quantity: updateProduct.quantity?.toString(),
        location: updateProduct.location,
        note: updateProduct.note,
        image: updateProduct.image,
      });
    }
  }, [isOpen]);

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Update Product</ModalHeader>
            <ModalBody>
              <Input label="Product Name" type="text" placeholder="Enter product name" value={formData.productName} name="productName" onChange={handleChange} isRequired />
              <Input label="Quantity" type="number" placeholder="Enter quantity" value={formData.quantity} name="quantity" onChange={handleChange} isRequired />
              <Select items={locationOptions} label="Location" placeholder="Enter location" selectedKeys={formData.location ? [formData.location] : []} name="location" onChange={handleChange} isRequired >
                {(location) => <SelectItem key={location.uid}>{location.name}</SelectItem>}
              </Select>
              <Input label="Note" type="text" placeholder="Enter note" value={formData.note} name="note" onChange={handleChange} />
              <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
              <Button color="default" endContent={<CameraIcon />} onPress={() => document.getElementById('fileInput')?.click()}>
                {fileName || 'Change Image'}
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={formData.productName.length === 0 || formData.quantity.length === 0 || formData.location.length === 0} isLoading={isLoading}>
                Save
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default UpdateProductModal;