import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import {
  Appbar,
  TextInput,
  Button,
  SegmentedButtons,
  Chip,
  Text,
  Surface,
  Snackbar,
} from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useProductStore } from '@/store/productStore';
import { Product, Gender, ProductCategory } from '@/types';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const GENDER_OPTIONS = [
  { value: Gender.BOYS, label: 'Boys' },
  { value: Gender.GIRLS, label: 'Girls' },
  { value: Gender.UNISEX, label: 'Unisex' },
];

const CATEGORY_OPTIONS = Object.values(ProductCategory);

export default function AdminProductEditScreen() {
  const router = useRouter();
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const isNew = productId === 'new';

  const products = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>(ProductCategory.SHIRTS);
  const [gender, setGender] = useState<Gender>(Gender.BOYS);
  const [price, setPrice] = useState('');
  const [wholesalePrice, setWholesalePrice] = useState('');
  const [totalStock, setTotalStock] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isNew) {
      const existing = products.find((p) => p.id === productId);
      if (existing) {
        setName(existing.name);
        setSku(existing.sku);
        setDescription(existing.description);
        setCategory(existing.category);
        setGender(existing.gender);
        setPrice(existing.price.toString());
        setWholesalePrice(existing.wholesalePrice.toString());
        setTotalStock(existing.totalStock.toString());
        setColor(existing.color);
        setMaterial(existing.material);
      }
    }
    setLoading(false);
  }, [productId, products]);

  const handleSave = async () => {
    if (!name || !sku || !price || !wholesalePrice) {
      setSnackMessage('Please fill in all required fields');
      setSnackVisible(true);
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const productFields = {
      name,
      sku,
      description,
      category,
      gender,
      price: parseFloat(price) || 0,
      wholesalePrice: parseFloat(wholesalePrice) || 0,
      totalStock: parseInt(totalStock, 10) || 0,
      imageUrl: `https://picsum.photos/seed/${sku}/400/400`,
      color,
      material,
      isActive: true,
    };

    if (isNew) {
      addProduct(productFields);
    } else {
      updateProduct(productId as string, productFields);
    }

    setIsSaving(false);
    setSnackMessage(isNew ? 'Product created successfully' : 'Product updated successfully');
    setSnackVisible(true);

    setTimeout(() => router.back(), 1000);
  };

  if (loading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  return (
    <View className="flex-1" style={{ backgroundColor: '#FFF8F0' }}>
      <Appbar.Header style={{ backgroundColor: '#FFFBF5' }}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={isNew ? 'Add Product' : 'Edit Product'} />
      </Appbar.Header>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          mode="outlined"
          label="Product Name *"
          value={name}
          onChangeText={setName}
          className="mb-3"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          mode="outlined"
          label="SKU *"
          value={sku}
          onChangeText={setSku}
          className="mb-3"
          style={{ marginBottom: 12 }}
        />

        <TextInput
          mode="outlined"
          label="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          className="mb-3"
          style={{ marginBottom: 12 }}
        />

        <Text variant="labelLarge" className="mb-2 font-bold" style={{ marginBottom: 8, fontWeight: 'bold' }}>
          Gender
        </Text>
        <SegmentedButtons
          value={gender}
          onValueChange={(val) => setGender(val as Gender)}
          buttons={GENDER_OPTIONS}
          style={{ marginBottom: 16 }}
        />

        <Text variant="labelLarge" className="mb-2 font-bold" style={{ marginBottom: 8, fontWeight: 'bold' }}>
          Category
        </Text>
        <View className="flex-row flex-wrap mb-4" style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
          {CATEGORY_OPTIONS.map((cat) => (
            <Chip
              key={cat}
              selected={category === cat}
              onPress={() => setCategory(cat)}
              className="mr-2 mb-2"
              style={{ marginRight: 8, marginBottom: 8 }}
              mode="outlined"
              showSelectedOverlay
            >
              {cat}
            </Chip>
          ))}
        </View>

        <View className="flex-row mb-3" style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View className="flex-1 mr-2" style={{ flex: 1, marginRight: 8 }}>
            <TextInput
              mode="outlined"
              label="MRP (Rs.) *"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1 ml-2" style={{ flex: 1, marginLeft: 8 }}>
            <TextInput
              mode="outlined"
              label="Wholesale Price (Rs.) *"
              value={wholesalePrice}
              onChangeText={setWholesalePrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TextInput
          mode="outlined"
          label="Total Stock"
          value={totalStock}
          onChangeText={setTotalStock}
          keyboardType="numeric"
          className="mb-3"
          style={{ marginBottom: 12 }}
        />

        <View className="flex-row mb-3" style={{ flexDirection: 'row', marginBottom: 12 }}>
          <View className="flex-1 mr-2" style={{ flex: 1, marginRight: 8 }}>
            <TextInput
              mode="outlined"
              label="Color"
              value={color}
              onChangeText={setColor}
            />
          </View>
          <View className="flex-1 ml-2" style={{ flex: 1, marginLeft: 8 }}>
            <TextInput
              mode="outlined"
              label="Material"
              value={material}
              onChangeText={setMaterial}
            />
          </View>
        </View>

        <Button
          mode="contained"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          contentStyle={{ paddingVertical: 6 }}
          className="mt-4"
          style={{ marginTop: 16 }}
        >
          {isNew ? 'Create Product' : 'Update Product'}
        </Button>
      </ScrollView>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
      >
        {snackMessage}
      </Snackbar>
    </View>
  );
}
