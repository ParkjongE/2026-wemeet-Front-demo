import { Sun, Cloud, CloudRain, Snowflake, type LucideIcon } from "lucide-react";
import type { Weather } from "../types";

export const WEATHER_OPTIONS: {
  value: Weather;
  label: string;
  icon: LucideIcon;
  colorClass: string;
}[] = [
  { value: "sunny", label: "맑음", icon: Sun, colorClass: "text-yellow-600" },
  { value: "cloudy", label: "흐림", icon: Cloud, colorClass: "text-gray-400" },
  { value: "rainy", label: "비", icon: CloudRain, colorClass: "text-blue-400" },
  { value: "snowy", label: "눈", icon: Snowflake, colorClass: "text-sky-300" },
];

export function getWeatherOption(weather?: Weather) {
  return WEATHER_OPTIONS.find((w) => w.value === weather);
}
