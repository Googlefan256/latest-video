import { Dom } from "native-dom";

export function ytJson(html: string) {
    const $ = Dom.dom(html);
    const content = $.walk(
        (node) =>
            node.tag() == "script" && node.text().includes("ytInitialData"),
    )[0].text();
    const json = JSON.parse(
        content.substring("var ytInitialData = ".length, content.length - 1),
    );
    return json;
}

export interface ChannelVideo {
    id: string;
    title: string;
    description: string;
    at: string;
    length: string;
    views: string;
    viewsShort: string;
    thumbnail: string;
    url: string;
}

export function jsonChannelVideos(html: string): ChannelVideo[] {
    const $ = ytJson(html);
    try {
        return $.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents
            .map((c: any) => c.richItemRenderer?.content?.videoRenderer)
            .filter((c: any) => c)
            .map((v: any) => ({
                id: v.videoId,
                title: v.title.runs[0].text,
                description: v.descriptionSnippet.runs[0].text,
                at: v.publishedTimeText.simpleText,
                length: v.lengthText.simpleText,
                views: v.viewCountText.simpleText,
                viewsShort: v.shortViewCountText.simpleText,
                thumbnail: v.thumbnail.thumbnails.at(-1).url,
                url: `https://www.youtube.com/watch?v=${v.videoId}`,
            }));
    } catch (e) {
        console.log(e);
        return [];
    }
}

export function channelToURL(channel: string) {
    if (channel.startsWith("@")) {
        channel = "@" + encodeURIComponent(channel.slice(1));
        return `https://www.youtube.com/${channel}`;
    } else {
        channel = encodeURIComponent(channel);
        return `https://www.youtube.com/channel/${channel}`;
    }
}

export async function channelVideos(channel: string) {
    const res = await fetch(`${channelToURL(channel)}/videos`, {
        redirect: "follow",
    });
    return jsonChannelVideos(await res.text());
}

export async function latestVideo(channel: string) {
    const videos = await channelVideos(channel);
    return videos[0];
}
