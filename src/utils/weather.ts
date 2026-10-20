import { Sun, Cloud, CloudRain, Snowflake, type LucideIcon } from "lucide-react";
import type { Weather } from "../types";

export const WEATHER_OPTIONS: {
  value: Weather;
  label: string;
  icon: LucideIcon;
  colorClass: string;
}[] = [
  { value: "sunny", label: "맑음", icon: Sun, colorClass: "text-warning" },
  { value: "cloudy", label: "흐림", icon: Cloud, colorClass: "text-brown/45" },
  { value: "rainy", label: "비", icon: CloudRain, colorClass: "text-ocean" },
  { value: "snowy", label: "눈", icon: Snowflake, colorClass: "text-ocean-soft" },
];

export function getWeatherOption(weather?: Weather | null) {
  return WEATHER_OPTIONS.find((w) => w.value === weather);
}
