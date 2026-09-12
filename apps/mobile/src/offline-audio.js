import f0 from './audio-data/fine-0';import f1 from './audio-data/fine-1';import f2 from './audio-data/fine-2';import f3 from './audio-data/fine-3';import f4 from './audio-data/fine-4';import f5 from './audio-data/fine-5';
import s0 from './audio-data/sunset-0';import s1 from './audio-data/sunset-1';import s2 from './audio-data/sunset-2';import s3 from './audio-data/sunset-3';import s4 from './audio-data/sunset-4';import s5 from './audio-data/sunset-5';
const mp3=b64=>`data:audio/mpeg;base64,${b64}`;
export const offlineAudio={fine:mp3(f0+f1+f2+f3+f4+f5),sunset:mp3(s0+s1+s2+s3+s4+s5)};
