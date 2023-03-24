import { Router } from 'express';
import { getHello } from '../../../controllers/hello.controller';

const router = Router({ mergeParams: true })

router.use('/hello', getHello)

export default router