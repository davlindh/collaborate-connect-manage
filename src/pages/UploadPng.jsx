import { useState } from 'react';
import { Container, VStack, Heading, Input, Button, Text } from '@chakra-ui/react';
import { uploadPngFiles } from '../utils/uploadPngFiles.js';

const UploadPng = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleFileChange = (event) => {
        setFiles(Array.from(event.target.files));
    };

    const handleUpload = async () => {
        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await uploadPngFiles(files);
            setSuccess('Files uploaded successfully!');
        } catch (error) {
            setError('Error uploading files.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Container centerContent maxW="container.md" py={10}>
            <VStack spacing={4} width="100%">
                <Heading as="h1" size="xl">Upload PNG Files</Heading>
                <Input type="file" multiple onChange={handleFileChange} />
                <Button colorScheme="blue" onClick={handleUpload} isLoading={uploading}>Upload</Button>
                {error && <Text color="red.500">{error}</Text>}
                {success && <Text color="green.500">{success}</Text>}
            </VStack>
        </Container>
    );
};

export default UploadPng;