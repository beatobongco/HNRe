import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";
import StoryCard from "./components/StoryCard";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { debug } from "console";

const server = setupServer(
  rest.get("/newstories.json", (req, res, ctx) => {
    return res(ctx.json(Array.from({ length: 500 }, (_, i) => i)));
  }),
  rest.get("/item/:itemId", (req, res, ctx) => {
    const { itemId } = req.params;
    const parsedId = parseInt(itemId.split(".")[0]);
    return res(
      ctx.json({
        by: `Testy McTestFace ${parsedId}`,
        descendants: 0,
        id: parsedId,
        score: 100,
        time: 1613642412,
        title:
          "Doist is leveraging natural language processing to skyrocket productivity and mental wellbeing",
        type: "story",
        url: "https://blog.doist.com/remote-work-mental-health/",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("renders App", async () => {
  render(<App apiURL="" />);
  expect(screen.getByRole("heading")).toHaveTextContent("HNRe");
  // TODO: mock IntersectionObserver properly, so I can test rendering of articles
});

test("renders StoryCard", async () => {
  const id = 1337;
  render(
    <StoryCard
      apiURL=""
      key={id}
      storyId={id}
      isOnline={true}
      isLastItem={false}
      updateMaxStory={() => {}}
    />
  );
  // TODO: refactor fetching to be in an api module, so can separate testing of getting data
  // and rendering components
});
