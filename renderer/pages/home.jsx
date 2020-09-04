import { useState, useRef, useEffect } from "react";
import electron from "electron";
import Head from "next/head";
import {
	Page,
	Text,
	Card,
	Note,
	Spacer,
	Input,
	Button,
	Table,
	Modal,
	Link,
} from "@geist-ui/react";

const ipcRenderer = electron.ipcRenderer || false;

export default function Home() {
	const inputRef = useRef();
	const [data, setData] = useState([]);
	const [modalCardIndex, setModal] = useState(-1);
	useEffect(() => {
		if (ipcRenderer) {
			ipcRenderer.on("query", (event, data) => {
				setData(JSON.parse(data));
			});
		}

		return () => {
			if (ipcRenderer) {
				ipcRenderer.removeAllListeners("query");
			}
		};
	}, []);
	return (
		<Page>
			<Head>
				<title>BackFiler</title>
				<meta charSet="UTF-8" />
			</Head>
			<Text h1>Welcome to BackFiler!</Text>
			<Note type="success">Type your FTS5 query in!</Note>
			<Spacer y={1.5} />
			<Card>
				<div
					style={{
						display: "flex",
					}}
				>
					<Input ref={inputRef} size="large" placeholder="Query" />
					<Button
						style={{
							marginLeft: "20px",
						}}
						onClick={() => {
							ipcRenderer.send("query", inputRef.current.value);
						}}
						shadow
						type="secondary"
					>
						Search
					</Button>
					<Link
						href="cards.html"
						style={{
							marginLeft: "auto",
						}}
					>
						<Button type="success">Add Cards</Button>
					</Link>
				</div>
				<Table
					data={data}
					style={{
						marginTop: "20px",
					}}
					onCell={(c, i) => {
						setModal(i);
					}}
				>
					<Table.Column prop="tag" label="Tag" />
					<Table.Column prop="cite" label="Citation" />
					<Table.Column prop="file" label="File" />
				</Table>
			</Card>
			<Modal
				width="90vw"
				open={modalCardIndex >= 0}
				onClose={() => setModal(-1)}
			>
				<div
					style={{
						textAlign: "left",
					}}
					dangerouslySetInnerHTML={{
						__html:
							modalCardIndex >= 0
								? data[modalCardIndex].card
								: "",
					}}
				/>
				<Modal.Action
					passive
					onClick={() => {
						ipcRenderer.send("delete", data[modalCardIndex].id);
						setModal(-1);
					}}
					style={{
						color: "red",
					}}
				>
					Delete
				</Modal.Action>
				<Modal.Action passive onClick={() => setModal(-1)}>
					Done
				</Modal.Action>
			</Modal>
		</Page>
	);
}
