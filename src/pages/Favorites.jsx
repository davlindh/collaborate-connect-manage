import { useState, useEffect } from "react";
import { Container, VStack, Heading, Box, Text, Button, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "../integrations/supabase/auth";
import { supabase } from "../integrations/supabase/index";

const Favorites = () => {
  const { session } = useSupabaseAuth();
  const [favorites, setFavorites] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      fetchFavorites();
      fetchUsers();
    }
  }, [session]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select("provider_id, providers (id, name, category, imageUrl)")
        .eq("user_id", session.user.id);

      if (error) {
        console.error('Error:', error);
        throw error;
      }
      setFavorites(data);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, email");

      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRemoveFavorite = async (providerId) => {
    try {
      const response = await fetch('https://example.com/api/remove-favorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          user_id: session.user.id,
          provider_id: providerId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error:', errorData);
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data);
      fetchFavorites();
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  if (!session) {
    return <Text>You need to be logged in to view your favorites.</Text>;
  }

  return (
    <Container centerContent maxW="container.md" py={10}>
      <VStack spacing={{ base: 2, md: 4 }} width="100%">
        <Heading as="h1" size="xl">Your Favorites</Heading>
        {favorites.length === 0 ? (
          <Text>No favorite providers found.</Text>
        ) : (
          favorites.map(({ provider_id, providers }) => (
            <Box key={provider_id} borderWidth="1px" borderRadius="lg" overflow="hidden" width="100%">
              <Image src={providers.imageUrl} alt={providers.name} />
              <Box p={5}>
                <Heading as="h3" size="md">{providers.name}</Heading>
                <Text>{providers.category}</Text>
                <Button colorScheme="red" onClick={() => handleRemoveFavorite(provider_id)}>Remove from Favorites</Button>
              </Box>
            </Box>
          ))
        )}
        <Heading as="h2" size="lg" mt={10}>Browse Users</Heading>
        {users.length === 0 ? (
          <Text>No users found.</Text>
        ) : (
          users.map(user => (
            <Box key={user.id} borderWidth="1px" borderRadius="lg" p={5} width="100%">
              <Heading as="h3" size="md">{user.username}</Heading>
              <Text>{user.email}</Text>
            </Box>
          ))
        )}
      </VStack>
    </Container>
  );
};

export default Favorites;