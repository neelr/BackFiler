import { useState, useRef, useEffect } from "react";
import electron from "electron";
import Head from "next/head";
import {
	Page,
	Text,
	Card,
	Note,
	Spacer,
	Code,
	Button,
	Modal,
	Link,
} from "@geist-ui/react";

const ipcRenderer = electron.ipcRenderer || false;

export default function Home() {
	let usingConsole = false;
	let consoleText = "Initialized Generator!";
	const inputRef = useRef();
	const [data, setData] = useState("Initialized Generator!");
	const [erase, setErase] = useState(false);
	useEffect(() => {
		if (ipcRenderer) {
			ipcRenderer.on("card-added", (event, arg) => {
				while (usingConsole) {}
				usingConsole = true;
				let args = JSON.parse(arg);
				setData(`${consoleText}\n${args[0]} ${args[1]}`);
				consoleText += `\n${args[0]} || ${args[1]}`;
				usingConsole = false;
			});
			ipcRenderer.on("cards-done", () => {
				while (usingConsole) {}
				usingConsole = true;
				setData(`${consoleText}\nDone!`);
				consoleText += `\nDone!`;
				usingConsole = false;
			});
		}

		return () => {
			if (ipcRenderer) {
				ipcRenderer.removeAllListeners();
			}
		};
	}, []);
	return (
		<Page>
			<Head>
				<title>BackFiler</title>
				<meta charSet="UTF-8" />
			</Head>
			<Text h1>Add Cards</Text>
			<Note type="success">You can only choose a folder</Note>
			<Spacer y={1.5} />
			<Card>
				<div
					style={{
						display: "flex",
					}}
				>
					<input
						ref={inputRef}
						type="file"
						directory=""
						webkitdirectory=""
						style={{ display: "none" }}
					/>
					<Button onClick={() => inputRef.current.click()}>
						Open Folder
					</Button>
					<Button
						style={{
							marginLeft: "20px",
						}}
						type="success"
						onClick={() => {
							if (inputRef.current.files[0]) {
								let relative =
									inputRef.current.files[0]
										.webkitRelativePath;
								let abspath = inputRef.current.files[0].path;
								let actual_abs =
									abspath.split(
										relative.split("/")[0]
									)[0] + relative.split("/")[0];
								setData(`Scraping "${actual_abs}"`);
								consoleText = `Scraping "${actual_abs}"`;
								usingConsole = false;
								ipcRenderer.send("scrape", actual_abs);
							} else {
								usingConsole = true;
								setData(`${consoleText}\nFolder not found!`);
								consoleText += "\nFolder not found!";
								usingConsole = false;
							}
						}}
					>
						Scrape!
					</Button>
					<div
						style={{
							marginLeft: "auto",
						}}
					>
						<Link href="home.html">
							<Button type="secondary">Back</Button>
						</Link>
					</div>
				</div>
			</Card>
			<Code block>{data}</Code>
			<Button type="error" onClick={() => setErase(true)}>
				Erase all cards
			</Button>
			<Modal open={erase} onClose={() => setErase(false)}>
				<Modal.Title>Erase All Cards</Modal.Title>
				<Modal.Subtitle>THIS IS IRREVERSIBLE</Modal.Subtitle>
				<Modal.Action passive onClick={() => setErase(false)}>
					Cancel
				</Modal.Action>
				<Modal.Action
					type="error"
					onClick={() => {
						ipcRenderer.send("delete-all");
						setErase(false);
					}}
					style={{
						color: "red",
					}}
				>
					Delete
				</Modal.Action>
			</Modal>
		</Page>
	);
}
