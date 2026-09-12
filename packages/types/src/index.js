export const ConnectionState = Object.freeze({ CANDIDATE:'candidate', REQUESTED:'requested', CONNECTED:'connected', DISMISSED:'dismissed', REJECTED:'rejected', EXPIRED:'expired', BLOCKED:'blocked', UNMATCHED:'unmatched' });
export const Problem = (status, title, detail) => ({ type:`https://synq.example/problems/${title.toLowerCase().replaceAll(' ','-')}`, title, status, detail });
