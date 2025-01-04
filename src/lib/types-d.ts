export type topicType = 'inland' | 'ausland' | 'sport' | 'wirtschaft' | 'video' | 'investigativ' | 'wissen';

export interface responseType {
    news?: NewsEntity[] | null;
    regional?: null[] | null;
    newStoriesCountLink: string;
    type: string;
    nextPage: string;
    newsCount?: number;
}
export interface NewsEntity {
    sophoraId: string;
    externalId: string;
    title: string;
    date: string;
    teaserImage: TeaserImage;
    tags?: TagsEntity[] | null;
    updateCheckUrl: string;
    tracking?: TrackingEntity[] | null;
    topline: string;
    firstSentence: string;
    details: string;
    detailsweb: string;
    shareURL: string;
    geotags?: null[] | null;
    regionId?: number;
    regionIds?: null[] | null;
    ressort: string;
    breakingNews: boolean;
    type: string;
    comments?: string | null;
}
export interface TeaserImage {
    alttext: string;
    imageVariants: ImageVariants;
    type: string;
    copyright?: string | null;
    title?: string | null;
}
export interface ImageVariants {
    '1x1-144': string;
    '1x1-256': string;
    '1x1-432': string;
    '1x1-640': string;
    '1x1-840': string;
    '16x9-256': string;
    '16x9-384': string;
    '16x9-512': string;
    '16x9-640': string;
    '16x9-960': string;
    '16x9-1280': string;
    '16x9-1920': string;
    '1x1 - 144'?: string;
    '1x1 - 256'?: string;
    '1x1 - 432'?: string;
    '1x1 - 640'?: string;
    '1x1 - 840'?: string | null;
    '16x9 - 256'?: string;
    '16x9 - 384'?: string;
    '16x9 - 512'?: string;
    '16x9 - 640'?: string;
    '16x9 - 960'?: string;
    '16x9 - 1280'?: string;
    '16x9 - 1920'?: string | null;
}
export interface TagsEntity {
    tag: string;
}
export interface TrackingEntity {
    sid: string;
    src: string;
    ctp: string;
    pdt: string;
    otp: string;
    cid: string;
    pti: string;
    bcr: string;
    type: string;
    av_full_show: boolean;
}

export interface Tracking {
    sid: string;
    src: string;
    ctp: string;
    pdt: string;
    otp: string;
    cid: string;
    pti: string;
    bcr: string;
    type: string;
    av_full_show: boolean;
    av_air_time?: string;
    assetid?: string;
    program?: string;
    title?: string;
    length?: string;
    c2?: string;
    c5?: string;
    c7?: string;
    c8?: string;
    c9?: string;
    c10?: string;
    c12?: string;
    c16?: string;
    c18?: string;
    type_nielsen?: string;
}

export interface Streams {
    adaptivestreaming?: string;
    h264s?: string;
    h264m?: string;
    h264xl?: string;
}

export interface Content {
    value: string;
    type: string;
}

export interface Channel {
    sophoraId: string;
    externalId: string;
    title: string;
    date?: string;
    teaserImage: TeaserImage;
    tags: any[];
    updateCheckUrl: string;
    tracking: Tracking[];
    streams: Streams;
    alttext: string;
    copyright: string;
    type: string;
    content?: Content[];
}

export interface videosType {
    channels: Channel[];
}
