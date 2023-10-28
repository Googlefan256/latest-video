import { latestVideo } from "./dist/index.mjs";

const video = await latestVideo("@HikakinTV");
console.log(video);
