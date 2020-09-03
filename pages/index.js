import { useState, useRef } from "react"
import axios from "axios"
import Head from 'next/head'
import { Page, Text, Card, Note, Code, Spacer, Input, Button, Table, Modal } from '@geist-ui/react'

export default function Home() {
    const inputRef = useRef()
    const [data, setData] = useState([])
    const [modalCardIndex, setModal] = useState(-1)
    return (
        <Page>
            <Head>
                <title>BackFiler</title>
            </Head>
            <Text h1>
                Welcome to BackFiler!
            </Text>
            <Note type="warning">Please do not fucking SQL Inject you dumbass</Note>
            <Spacer y={1.5} />
            <Card>
                <div style={{
                    display: "flex"
                }}>
                    <Input ref={inputRef} size="large" placeholder="Query" />
                    <Button style={{
                        marginLeft: "20px"
                    }} onClick={async () => {
                        let rows = await axios.post('/api/query', {
                            query: inputRef.current.value
                        })
                        console.log(rows.data)
                        setData(rows.data == null ? [] : rows.data)
                    }} shadow type="secondary">Search</Button>
                </div>
                <Table data={data} style={{
                    marginTop: "20px"
                }}
                    onCell={(c, i) => {
                        setModal(i)
                    }}>
                    <Table.Column prop="tag" label="Tag" />
                    <Table.Column prop="cite" label="Citation" />
                    <Table.Column prop="file" label="File" />
                </Table>
            </Card>
            <Modal width="90vw" open={modalCardIndex > 0} onClose={() => setModal(-1)}>
                <div style={{
                    textAlign: "left"
                }} dangerouslySetInnerHTML={{ __html: modalCardIndex > 0 ? data[modalCardIndex].card : "" }} />
                <Modal.Action passive onClick={() => setModal(-1)}>Done</Modal.Action>
            </Modal>
        </Page >
    )
}