import heroUrl from "./illustrations/hero.svg";
import mascotWaveUrl from "./illustrations/mascot-wave.svg";
import mascotReadUrl from "./illustrations/mascot-read.svg";
import mascotWriteUrl from "./illustrations/mascot-write.svg";
import mascotHugUrl from "./illustrations/mascot-hug.svg";
import storyScene1 from "./illustrations/story-scene-1.svg";
import storyScene2 from "./illustrations/story-scene-2.svg";
import storyScene3 from "./illustrations/story-scene-3.svg";
import storyScene4 from "./illustrations/story-scene-4.svg";
import storyScene5 from "./illustrations/story-scene-5.svg";
import diaryPark from "./illustrations/diary-scene-park.svg";
import diaryBlocks from "./illustrations/diary-scene-blocks.svg";
import diaryBook from "./illustrations/diary-scene-book.svg";
import diaryDrawing from "./illustrations/diary-scene-drawing.svg";
import diaryGarden from "./illustrations/diary-scene-garden.svg";
import diaryNap from "./illustrations/diary-scene-nap.svg";
import iconPhotoStart from "./illustrations/icon-photo-start.svg";
import iconCalendarGrowth from "./illustrations/icon-calendar-growth.svg";

export const hero = heroUrl;

export const mascot = {
  wave: mascotWaveUrl,
  read: mascotReadUrl,
  write: mascotWriteUrl,
  hug: mascotHugUrl,
};

export const shovelStoryScenes = [storyScene1, storyScene2, storyScene3, storyScene4, storyScene5];

export const genericDiaryScenes = [
  diaryPark,
  diaryBlocks,
  diaryBook,
  diaryDrawing,
  diaryGarden,
  diaryNap,
];

export const pointIcons = {
  photoStart: iconPhotoStart,
  shortStory: diaryDrawing,
  growthByDate: iconCalendarGrowth,
};
