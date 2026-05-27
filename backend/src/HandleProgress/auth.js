import express from 'express'
import { handleProgress } from './handleProgress.js'
import { getProgress } from './getProgress.js'
import { receiveData } from './dataReciever.js'
import { getAllUser } from './getAllUser.js'
import { getAllProgress } from './getAllProgress.js'

const router = express.Router();

router.post('/dashboard', handleProgress)
router.post('/getProgres', getProgress)
router.post('/receiveData', receiveData)
router.get('/getAllUser', getAllUser)
router.get('/getAllProgress', getAllProgress)

export default router