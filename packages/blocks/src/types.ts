export type TitleBlock = {
  id: string;
  type: "title";
  content: { text: string };
};

export type ParagraphBlock = {
  id: string;
  type: "paragraph";
  content: { text: string };
};

export type ImageBlock = {
  id: string;
  type: "image";
  content: {
    src: string;
    alt: string;
    caption?: string;
  };
};

export type ContentBlock = TitleBlock | ParagraphBlock | ImageBlock;

export type ContentDocument = {
  version: 1;
  blocks: ContentBlock[];
};
