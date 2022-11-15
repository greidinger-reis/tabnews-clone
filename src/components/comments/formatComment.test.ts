import { describe, expect, it } from "vitest";
import formatComments from "./formatComment";

const comments = [
    {
        id: "cl6kjg8is0083hr09t1v6b8pc",
        body: "DSA dreamcatcher blue bottle etsy cray. Vexillologist heirloom raw denim tote bag, gentrify mustache offal. Squid Brooklyn occupy cray, typewriter semiotics trust fund tbh single-origin coffee distillery portland. Pickled hexagon edison bulb irony jianbing, tumblr celiac austin truffaut marfa cardigan jean shorts ascot direct trade pork belly. Church-key mumblecore art party polaroid letterpress photo booth knausgaard.",
        parentId: null,
        postId: "cl6kjfxd90045hr09qrj4001s",
        userId: "cl6kjfi9v0030hr09a3cfruss",
        createdAt: "2022-08-08T09:15:33.796Z",
        updatedAt: "2022-08-08T09:15:33.796Z",
        user: {
            id: "cl6kjfi9v0030hr09a3cfruss",
            name: "tom",
            email: "tom@example.com",
            emailVerified: null,
            image: null,
        },
    },
    {
        id: "cl6kjhetz0129hr0946rt5v7r",
        body: "DSA dreamcatcher blue bottle etsy cray. Vexillologist heirloom raw denim tote bag, gentrify mustache offal. Squid Brooklyn occupy cray, typewriter semiotics trust fund tbh single-origin coffee distillery portland. Pickled hexagon edison bulb irony jianbing, tumblr celiac austin truffaut marfa cardigan jean shorts ascot direct trade pork belly. Church-key mumblecore art party polaroid letterpress photo booth knausgaard.",
        parentId: null,
        postId: "cl6kjfxd90045hr09qrj4001s",
        userId: "cl6kjfi9v0030hr09a3cfruss",
        createdAt: "2022-08-08T09:16:28.631Z",
        updatedAt: "2022-08-08T09:16:28.631Z",
        user: {
            id: "cl6kjfi9v0030hr09a3cfruss",
            name: "tom",
            email: "tom@example.com",
            emailVerified: null,
            image: null,
        },
    },
    {
        id: "cl6kjhq980158hr092ygm67kx",
        body: "An awesome reply",
        parentId: "cl6kjg8is0083hr09t1v6b8pc",
        postId: "cl6kjfxd90045hr09qrj4001s",
        userId: "cl6kjfi9v0030hr09a3cfruss",
        createdAt: "2022-08-08T09:16:43.435Z",
        updatedAt: "2022-08-08T09:16:43.436Z",
        user: {
            id: "cl6kjfi9v0030hr09a3cfruss",
            name: "tom",
            email: "tom@example.com",
            emailVerified: null,
            image: null,
        },
    },
    {
        id: "cl6kjlqu70309hr093eizrvlk",
        body: "Another reply",
        parentId: "cl6kjg8is0083hr09t1v6b8pc",
        postId: "cl6kjfxd90045hr09qrj4001s",
        userId: "cl6kjfi9v0030hr09a3cfruss",
        createdAt: "2022-08-08T09:19:50.815Z",
        updatedAt: "2022-08-08T09:19:50.815Z",
        user: {
            id: "cl6kjfi9v0030hr09a3cfruss",
            name: "tom",
            email: "tom@example.com",
            emailVerified: null,
            image: null,
        },
    },
    {
        id: "cl6kjscpm0061wv095u2sn8ph",
        body: "A reply to a reply",
        parentId: "cl6kjlqu70309hr093eizrvlk",
        postId: "cl6kjfxd90045hr09qrj4001s",
        userId: "cl6kjfi9v0030hr09a3cfruss",
        createdAt: "2022-08-08T09:24:59.098Z",
        updatedAt: "2022-08-08T09:24:59.099Z",
        user: {
            id: "cl6kjfi9v0030hr09a3cfruss",
            name: "tom",
            email: "tom@example.com",
            emailVerified: null,
            image: null,
        },
    },
    {
        id: "cl6kjuez90155wv091xoicbw4",
        body: "A reply to a reply",
        parentId: "cl6kjlqu70309hr093eizrvlk",
        postId: "cl6kjfxd90045hr09qrj4001s",
        userId: "cl6kjfi9v0030hr09a3cfruss",
        createdAt: "2022-08-08T09:26:35.349Z",
        updatedAt: "2022-08-08T09:26:35.350Z",
        user: {
            id: "cl6kjfi9v0030hr09a3cfruss",
            name: "tom",
            email: "tom@example.com",
            emailVerified: null,
            image: null,
        },
    },
];

describe("format comments", () => {
    it("should nest children comments", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(formatComments(comments)).toMatchInlineSnapshot(`
      [
        {
          "body": "DSA dreamcatcher blue bottle etsy cray. Vexillologist heirloom raw denim tote bag, gentrify mustache offal. Squid Brooklyn occupy cray, typewriter semiotics trust fund tbh single-origin coffee distillery portland. Pickled hexagon edison bulb irony jianbing, tumblr celiac austin truffaut marfa cardigan jean shorts ascot direct trade pork belly. Church-key mumblecore art party polaroid letterpress photo booth knausgaard.",
          "children": [
            {
              "body": "An awesome reply",
              "children": [],
              "createdAt": "2022-08-08T09:16:43.435Z",
              "id": "cl6kjhq980158hr092ygm67kx",
              "parentId": "cl6kjg8is0083hr09t1v6b8pc",
              "postId": "cl6kjfxd90045hr09qrj4001s",
              "updatedAt": "2022-08-08T09:16:43.436Z",
              "user": {
                "email": "tom@example.com",
                "emailVerified": null,
                "id": "cl6kjfi9v0030hr09a3cfruss",
                "image": null,
                "name": "tom",
              },
              "userId": "cl6kjfi9v0030hr09a3cfruss",
            },
            {
              "body": "Another reply",
              "children": [
                {
                  "body": "A reply to a reply",
                  "children": [],
                  "createdAt": "2022-08-08T09:24:59.098Z",
                  "id": "cl6kjscpm0061wv095u2sn8ph",
                  "parentId": "cl6kjlqu70309hr093eizrvlk",
                  "postId": "cl6kjfxd90045hr09qrj4001s",
                  "updatedAt": "2022-08-08T09:24:59.099Z",
                  "user": {
                    "email": "tom@example.com",
                    "emailVerified": null,
                    "id": "cl6kjfi9v0030hr09a3cfruss",
                    "image": null,
                    "name": "tom",
                  },
                  "userId": "cl6kjfi9v0030hr09a3cfruss",
                },
                {
                  "body": "A reply to a reply",
                  "children": [],
                  "createdAt": "2022-08-08T09:26:35.349Z",
                  "id": "cl6kjuez90155wv091xoicbw4",
                  "parentId": "cl6kjlqu70309hr093eizrvlk",
                  "postId": "cl6kjfxd90045hr09qrj4001s",
                  "updatedAt": "2022-08-08T09:26:35.350Z",
                  "user": {
                    "email": "tom@example.com",
                    "emailVerified": null,
                    "id": "cl6kjfi9v0030hr09a3cfruss",
                    "image": null,
                    "name": "tom",
                  },
                  "userId": "cl6kjfi9v0030hr09a3cfruss",
                },
              ],
              "createdAt": "2022-08-08T09:19:50.815Z",
              "id": "cl6kjlqu70309hr093eizrvlk",
              "parentId": "cl6kjg8is0083hr09t1v6b8pc",
              "postId": "cl6kjfxd90045hr09qrj4001s",
              "updatedAt": "2022-08-08T09:19:50.815Z",
              "user": {
                "email": "tom@example.com",
                "emailVerified": null,
                "id": "cl6kjfi9v0030hr09a3cfruss",
                "image": null,
                "name": "tom",
              },
              "userId": "cl6kjfi9v0030hr09a3cfruss",
            },
          ],
          "createdAt": "2022-08-08T09:15:33.796Z",
          "id": "cl6kjg8is0083hr09t1v6b8pc",
          "parentId": null,
          "postId": "cl6kjfxd90045hr09qrj4001s",
          "updatedAt": "2022-08-08T09:15:33.796Z",
          "user": {
            "email": "tom@example.com",
            "emailVerified": null,
            "id": "cl6kjfi9v0030hr09a3cfruss",
            "image": null,
            "name": "tom",
          },
          "userId": "cl6kjfi9v0030hr09a3cfruss",
        },
        {
          "body": "DSA dreamcatcher blue bottle etsy cray. Vexillologist heirloom raw denim tote bag, gentrify mustache offal. Squid Brooklyn occupy cray, typewriter semiotics trust fund tbh single-origin coffee distillery portland. Pickled hexagon edison bulb irony jianbing, tumblr celiac austin truffaut marfa cardigan jean shorts ascot direct trade pork belly. Church-key mumblecore art party polaroid letterpress photo booth knausgaard.",
          "children": [],
          "createdAt": "2022-08-08T09:16:28.631Z",
          "id": "cl6kjhetz0129hr0946rt5v7r",
          "parentId": null,
          "postId": "cl6kjfxd90045hr09qrj4001s",
          "updatedAt": "2022-08-08T09:16:28.631Z",
          "user": {
            "email": "tom@example.com",
            "emailVerified": null,
            "id": "cl6kjfi9v0030hr09a3cfruss",
            "image": null,
            "name": "tom",
          },
          "userId": "cl6kjfi9v0030hr09a3cfruss",
        },
      ]
    `);
    });
});
