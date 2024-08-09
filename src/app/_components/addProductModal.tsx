import React, { useState, useEffect } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, Input, Select, SelectItem, Button, ModalFooter } from '@nextui-org/react';
import { CameraIcon } from './cameraIcon';
import { type Product } from '~/utils/data';
import { useUploadThing } from '~/utils/uploadthing';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  locationOptions: Array<{ uid: string, name: string }>;
  onSubmit: (product: Product) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, locationOptions, onSubmit }) => {
  const [formData, setFormData] = useState({
    productName: '',
    quantity: '',
    location: '',
    note: '',
    image: '',
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

    if (selectedFile) {
      const uploadResult = await startUpload([selectedFile]);
      if (uploadResult && uploadResult.length > 0 && uploadResult[0]?.url) {
        formData.image = uploadResult[0].url;
      }
    }

    onSubmit({
      id: '',
      productName: formData.productName,
      quantity: parseInt(formData.quantity),
      location: formData.location,
      note: formData.note,
      image: formData.image,
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
    }
  }, [isOpen]);

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <form onSubmit={handleSubmit}>
            <ModalHeader className="flex flex-col gap-1">Add a Product</ModalHeader>
            <ModalBody>
              <Input label="Product Name" type="text" placeholder="Enter product name" name="productName" onChange={handleChange} isRequired />
              <Input label="Quantity" type="number" placeholder="Enter quantity" name="quantity" onChange={handleChange} isRequired />
              <Select items={locationOptions} label="Location" placeholder="Enter location" name="location" onChange={handleChange} isRequired>
                {(location) => <SelectItem key={location.uid}>{location.name}</SelectItem>}
              </Select>
              <Input label="Note" type="text" placeholder="Enter note" name="note" onChange={handleChange} />
              <input type="file" id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
              <Button color="default" endContent={<CameraIcon />} onPress={() => document.getElementById('fileInput')?.click()}>
                {fileName || 'Add an Image'}
              </Button>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Cancel
              </Button>
              <Button type="submit" color="primary" disabled={formData.productName.length === 0 || formData.quantity.length === 0 || formData.location === ""} isLoading={isLoading}>
                Add
              </Button>
            </ModalFooter>
          </form>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddProductModal;