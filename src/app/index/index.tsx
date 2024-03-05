import { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";

import { services } from "@/services";

import { Ingredient } from "@/components/ingredient";
import { Selected } from "@/components/selected";

import { styles } from "./styles";

export default function HomeScreen() {
  const [ingredients, setIngredients] = useState<IngredientResponse[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    services.ingredients.findAll().then(setIngredients);
  }, []);

  function handleToggleSelected(value: string) {
    if (selected.includes(value)) {
      return setSelected((state) => state.filter((item) => item !== value));
    }

    setSelected((state) => [...state, value]);
  }

  function handleClearSelected() {
    Alert.alert("Limpar", "Deseja limpar tudo?", [
      { text: "Não", style: "cancel" },
      { text: "Sim", onPress: () => setSelected([]) },
    ]);
  }

  function handleSearch() {
    router.navigate("/recipes/" + selected);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Escolha{"\n"}
        <Text style={styles.subtile}>os produtos</Text>
      </Text>

      <Text style={styles.message}>Descubra receitas baseadas nos produtos que você escolheu.</Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.ingredients}>
        {ingredients.map((item) => (
          <Ingredient
            key={item.id}
            name={item.name}
            image={`${services.storage.imagePath}/${item.image}`}
            selected={selected.includes(String(item.id))}
            onPress={() => handleToggleSelected(String(item.id))}
          />
        ))}
      </ScrollView>

      {selected.length > 0 && <Selected quantity={selected.length} onClear={handleClearSelected} onSearch={handleSearch} />}
    </View>
  );
}
