const express = require("express")
const request = require("supertest")
const router = require("../routes/users")
const db = require("../config/connection")

const app = express()
app.use("/", router)

describe("test handlers", function () {
    test("respond to /", async () => {
        const response = await request(app).get("/")
        expect(response.text).toEqual("API READY TO GO!")
    })

    test("respond to /employee", async () => {
        const response = await request(app).get("/employee")
        const sql = `SELECT * FROM employee`

        db.query(sql, (err, data) => {
            expect(err).toBeNull()
            expect(response.body).toEqual({
                status: true,
                message: "GET Success",
                data: data,
            })
        })
    })
})

test("post to /employee", async () => {
    const reqBody = {
        nama: "Rizky1",
        job: "Software Enbineer",
        salary: 5000,
    }

    const response = await request(app)
        .post("/employee")
        .send(reqBody)
        .set("Accept", "application/json")

    try {
        const { nama, job, salary } = req.body
        const sql = `INSERT INTO employee (nama, job, salary) VALUES ('${nama}', '${job}', ${salary})`

        db.query(sql, (err, data) => {
            expect(err).toBeNull()
            expect(response.body).toEqual({
                status: true,
                message: "Data Created",
                data: {
                    id: data.insertId,
                    fields: req.body,
                },
            })
        })
    } catch (err) {
        console.log(err)
    }
})
