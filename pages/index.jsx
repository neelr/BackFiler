import Head from "next/head";
import { Page, Text, Card, Code, Spacer } from "@geist-ui/react";

export default function Home() {
	return (
		<Page>
			<Head>
				<title>BackFiler</title>
				<meta name="title" content="BackFiler" />
				<meta
					name="description"
					content="The best way to index your debate backfiles for cards!"
				/>

				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://backfiler.now.sh/" />
				<meta property="og:title" content="BackFiler" />
				<meta
					property="og:description"
					content="The best way to index your debate backfiles for cards!"
				/>
				<meta
					property="og:image"
					content="https://doggo.ninja/QH45hq.png"
				/>

				<meta property="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:url"
					content="https://backfiler.now.sh/"
				/>
				<meta property="twitter:title" content="BackFiler" />
				<meta
					property="twitter:description"
					content="The best way to index your debate backfiles for cards!"
				/>
				<meta
					property="twitter:image"
					content="https://doggo.ninja/QH45hq.png"
				/>
			</Head>
			<Text h1>
				<a href="https://github.com/neelr/BackFiler">BackFiler</a>
			</Text>
			<Text>
				Made with 💖 by <a href="https://neelr.dev">@neelr</a>,{" "}
				<strong>MIT License</strong>
			</Text>
			<Card>
				<Text h2>What is it?</Text>
				<Text>
					BackFiler is a great way to index your cards from your
					debate files automatically so you can query them easily!
					Just insert a folder into the app, and it'll crawl the
					entire folder for <Code>.docx</Code> files, and save the
					cards in a sqlite3 database! All you need to do is install
					pandoc, and you can start scraping your entire dropbox for
					cards!
				</Text>
			</Card>
			<Spacer y={"1.5"} />
			<Card>
				<Text h2>Installation</Text>
				<ol>
					<li>
						Install the pandoc CLI{" "}
						<a href="https://pandoc.org/installing.html">
							from the pandoc website
						</a>
						, or through your favorite package manager like brew, or
						choco
					</li>
					<li>
						Download your packaged file specific to your OS from the{" "}
						<a href="https://github.com/neelr/BackFiler/releases">
							releases tab
						</a>
						!
					</li>
				</ol>
			</Card>
			<Spacer y={"1.5"} />
			<Card>
				<Text h2>Contributing</Text>
				<ol>
					<li>
						Install all packages with <Code>npm i</Code>
					</li>
					<li>
						Live reload for development using{" "}
						<Code>npm run dev</Code>
					</li>
					<li>
						To build for production run{" "}
						<Code>npm run build:all</Code>
					</li>
				</ol>
			</Card>
		</Page>
	);
}
