const express = require('express')
const app = express()

const mailchimp = require("@mailchimp/mailchimp_marketing");

mailchimp.setConfig({
  apiKey: "e7897a2e7ab959f3c3e672fa85797352-us17",
  server: "us17",
});

const listId = "4161768eb3";


app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.post('/', (req, res) => {
    const { firstName, lastName, email } = req.body
    const user = {
        firstName,
        lastName,
        email
    }

    async function run(subscriber) {
        try {
            const response = await mailchimp.lists.addListMember(listId, {
                email_address: subscriber.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscriber.firstName,
                    LNAME: subscriber.lastName
                }
              })

            res.sendFile(__dirname + '/success.html')

        } catch(err) {
            res.sendFile(__dirname + '/failure.html')
        }

    }

    run(user)
})

app.post('/failure', (req, res) => {
    res.redirect('/')
})



app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port 3000`)
})

// e7897a2e7ab959f3c3e672fa85797352-us17
// 4161768eb3
