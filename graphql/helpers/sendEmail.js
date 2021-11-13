import axios from 'axios'


export const sendEmail = async (data) => {
    const { name, email, subject, bodyContent } = data
    await axios.post(
        'https://api.sendinblue.com/v3/smtp/email', {
            sender: {  
                name: process.env.EMAIL_SENDER_NAME,
                email: process.env.EMAIL_SENDER_EMAIL,
            },
            to: [{  
                name,
                email,
            }],
            subject,
            htmlContent: `
                <html>
                    <head>
                    </head>
                    <body>
                        ${bodyContent}
                    </body>
                </html>
            `
        }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-key': process.env.EMAIL_SENDER_API_KEY,
            }
        }
    )
}