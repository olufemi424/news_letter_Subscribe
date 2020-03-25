const express = require("express");
const request = require("request");
const path = require("path");

const app = express();

//bodyparser middleware
app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, "public")));

//signup route
app.post("/signup", (req, res) => {
	const { firstName, lastName, email } = req.body;

	// validation
	if (!firstName || !lastName || !email) {
		res.redirect("/fail.html");
		return;
	}

	//construct request data
	const data = {
		members: [
			{
				email_address: email,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName
				}
			}
		]
	};

	//convers to json
	const postData = JSON.stringify(data);

	//set up options
	const options = {
		url: "https://us19.api.mailchimp.com/3.0/lists/80a18afb52",
		method: "POST",
		headers: {
			Authorization: "auth b90d8993e16035e335aa35efabe11de5-us19"
		},
		body: postData
	};

	//post request
	request(options, (err, response, body) => {
		//check for err
		if (err) {
			res.redirect("/fail.html");
		} else {
			//response err
			if (response.statusCode === 200) {
				res.redirect("/success.html");
			} else {
				res.redirect("/fail.html");
			}
		}
	});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`);
});
