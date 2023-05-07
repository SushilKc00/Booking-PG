import express from "express";
import axios from "axios"
import { body, validationResult } from  'express-validator'
import User from "../models/User.js";
import  bcrypt from 'bcryptjs'
 import jwt from 'jsonwebtoken'
 const   jwtSecret = "HaHa"
const  router = express.Router();

router.post("/register", [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            email: req.body.email,
            location: req.body.location
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true
            res.json({ success, authToken })
        })
            .catch(err => {
                console.log(err);
                res.json({ err })
            })
    } catch (error) {
        console.error(error.message)
    }
})



router.post("/login", [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success = true;
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ success, authToken })


    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }})


    router.post('/getlocation', async (req, res) => {
        try {
            let lat = req.body.latlong.lat
            let long = req.body.latlong.long
            console.log(lat, long)
            let location = await axios
                .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=74c89b3be64946ac96d777d08b878d43")
                .then(async res => {
                    // console.log(`statusCode: ${res.status}`)
                    console.log(res.data.results)
                    // let response = stringify(res)
                    // response = await JSON.parse(response)
                    let response = res.data.results[0].components;
                    console.log(response)
                    let { village, county, state_district, state, postcode } = response
                    return String(village + "," + county + "," + state_district + "," + state + "\n" + postcode)
                })
                .catch(error => {
                    console.error(error)
                })
            res.send({ location })
    
        } catch (error) {
            console.error(error.message)
            res.send("Server Error")
    
        }
    })

export default router