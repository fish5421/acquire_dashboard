import React, { useState, useEffect } from 'react';
import * as SliderPrimitive from "@radix-ui/react-slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/lib/utils';

const RangeFilter = ({ label, min, max, value, onChange, presets }) => {
  const [error, setError] = useState('');
  const [selectedPreset, setSelectedPreset] = useState(null);

  const handleInputChange = (index) => (e) => {
    const newValue = e.target.value === '' ? '' : Number(e.target.value);
    const updatedValue = [...value];
    updatedValue[index] = newValue;
    validateAndUpdate(updatedValue);
    setSelectedPreset(null);
  };

  const validateAndUpdate = (newValue) => {
    const [newMin, newMax] = newValue;
    if (newMin > newMax) {
      setError('Min value cannot be greater than max value');
    } else if (newMin < min || newMax > max) {
      setError(`Values must be between ${formatCurrency(min)} and ${formatCurrency(max)}`);
    } else {
      setError('');
      onChange(newValue);
    }
  };

  const handlePresetClick = (presetMin, presetMax, index) => {
    validateAndUpdate([presetMin, presetMax]);
    setSelectedPreset(index);
  };

  const normalizeValue = (val) => {
    return ((val - min) / (max - min)) * 100;
  };

  const handleSliderChange = (newValue) => {
    const denormalizedValue = newValue.map((normalizedValue) => {
      return (normalizedValue / 100) * (max - min) + min;
    });
    validateAndUpdate(denormalizedValue);
    setSelectedPreset(null);
  };

  useEffect(() => {
    // Check if current value matches any preset
    const matchingPresetIndex = presets.findIndex(
      preset => preset.min === value[0] && preset.max === value[1]
    );
    setSelectedPreset(matchingPresetIndex !== -1 ? matchingPresetIndex : null);
  }, [value, presets]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm text-gray-500">
          {formatCurrency(value[0])} - {formatCurrency(value[1])}
        </span>
      </div>
      <SliderPrimitive.Root
        min={0}
        max={100}
        step={0.1}
        value={[normalizeValue(value[0]), normalizeValue(value[1])]}
        onValueChange={handleSliderChange}
        className="relative flex items-center w-full h-5 touch-none"
        aria-label={`${label} range`}
      >
        <SliderPrimitive.Track className="relative w-full h-2 grow rounded-full bg-gray-200">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-blue-500" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          className="block w-5 h-5 rounded-full bg-white border-2 border-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
          aria-label={`${label} minimum value`}
        />
        <SliderPrimitive.Thumb
          className="block w-5 h-5 rounded-full bg-white border-2 border-blue-500 focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
          aria-label={`${label} maximum value`}
        />
      </SliderPrimitive.Root>
      <div className="flex items-center space-x-4">
        <Input
          type="number"
          value={value[0]}
          onChange={handleInputChange(0)}
          className="w-24"
          aria-label={`Minimum ${label}`}
        />
        <span className="text-gray-500">to</span>
        <Input
          type="number"
          value={value[1]}
          onChange={handleInputChange(1)}
          className="w-24"
          aria-label={`Maximum ${label}`}
        />
      </div>
      {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-2">
        {presets.map((preset, index) => (
          <Button
            key={index}
            size="sm"
            onClick={() => handlePresetClick(preset.min, preset.max, index)}
            className={`transition-colors ${
              selectedPreset === index
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RangeFilter;