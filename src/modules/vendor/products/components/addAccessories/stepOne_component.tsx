import React, { useRef, useState } from 'react'
import { Control, Controller } from 'react-hook-form';
import { View, Text, TextInput, Button, KeyboardAvoidingView, Platform } from 'react-native'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';
import { IStepOneAddProduct } from '../../validations/addProduct_validation';

interface IProps {
    control: Control<IStepOneAddProduct>;
    errors: any;
}

const StepOneComponent: React.FC<IProps> = ({ control, errors }) => {

    const richTextEditorRef = useRef<RichEditor>(null);

    return (
        <View>
            <Text className="mt-5 font-montserratSemiBold text-base text-baseGreen">Step 1: Basic Details</Text>
            <Text className="mt-2 font-montserratMedium">Enter all correct basid details for this product and proceed.</Text>

            <Text aria-label="Product Title" nativeID="productTitle" className="mt-6 font-montserratMedium">Product title<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <Controller
                    control={control}
                    name="title"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Product Title"
                            aria-labelledby="productTitle"
                            keyboardType="default"
                            placeholder="Enter title"
                            placeholderTextColor="#9ca3af"
                            className="font-montserratMedium text-base"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    )}
                />
                { errors.title && <Text className="text-red-600">{errors.title.message}</Text> }
            </View>
            
            <Text aria-label="Product Subtitle" nativeID="productSubtitle" className="mt-5 font-montserratMedium">Product subtitle<Text className="text-red-600">*</Text></Text>
            <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <Controller
                    control={ control }
                    name="subTitle"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Product Subtitle"
                            aria-labelledby="productSubtitle"
                            keyboardType="default"
                            placeholder="Enter subtitle"
                            placeholderTextColor="#9ca3af"
                            className="font-montserratMedium text-base"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    )}
                />
                {  errors.subTitle && <Text className="text-red-600">{errors.subTitle.message}</Text> }
            </View>
            
            <Text aria-label="Description" nativeID="description" className="mt-5 font-montserratMedium">Product description<Text className="text-red-600">*</Text></Text>
            <View className="h-[170px] w-full mt-1.5  border rounded-xl border-gray-200 bg-white">
                <Controller
                    control={ control }
                    name="description"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
                            <RichToolbar
                                editor={richTextEditorRef}
                                actions={[
                                    actions.setBold,
                                    actions.setItalic,
                                    actions.setUnderline,
                                    actions.setStrikethrough,
                                    actions.insertBulletsList,
                                    actions.insertOrderedList,
                                    actions.indent,
                                    actions.outdent,
                                    actions.alignLeft,
                                    actions.alignRight,
                                    actions.insertLink,
                                ]}
                                iconTint="#000"
                                iconSize={16}
                                selectedIconTint="#007AFF"
                                disabledIconTint="#ccc"
                                className="rounded-tl-lg rounded-tr-lg bg-gray-200"
                            />
                            <RichEditor
                                ref={ richTextEditorRef }
                                initialContentHTML={ value } // Bind value here
                                placeholder='Enter description'
                                onChange={(html) => onChange(html)} // Update React Hook Form state
                                onBlur={ onBlur }
                                editorStyle={{
                                    backgroundColor: '#FFFFFF',
                                    cssText: 'body { font-size: 14px !important; }',
                                }}
                                className="min-h-[115px] min-w-full"
                            />
                        </KeyboardAvoidingView>
                    )}
                />
                {  errors.description && <Text className="text-red-600">{errors.description.message}</Text> }
            </View>
            {/* <View className="h-auto w-full mt-1.5 px-3 py-0.5 border rounded-xl border-gray-200 bg-gray-50">
                <Controller
                    control={ control }
                    name="description"
                    render={ ({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            aria-label="Description"
                            aria-labelledby="description"
                            keyboardType="default"
                            placeholder="Enter description"
                            placeholderTextColor="#9ca3af"
                            multiline={ true }
                            textAlignVertical="top"
                            className="h-[100px] font-montserratMedium text-base"
                            onBlur={ onBlur }
                            onChangeText={ onChange }
                            value={ value }
                        />
                    )}
                />
                {  errors.description && <Text className="text-red-600">{errors.description.message}</Text> }
            </View> */}
        </View>
    );
};

export default StepOneComponent;