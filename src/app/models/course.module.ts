export interface Module {
  title: string;
  content: string;
  desc: string;
  Resource: string;
}

export interface Chapter {
  title: string;
  expanded?: boolean;
  modules: Module[];
}

export interface Course {
  title: string;
  language: string;
  thumbnail: string;
  duration: string;
  expanded?: boolean;
  chapters: Chapter[];
}
