import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Enrollment from '../models/Enrollment';
// import Student from '../models/Student';
import Plan from '../models/Plan';

// import UserControler from './UserControler';

class EnrollmentController {
  async index(req, res) {
    try {
      const { page = 1, quantity = 20 } = req.query;

      const { rows: enrollments } = await Enrollment.findAndCountAll({
        limit: quantity,
        offset: (page - 1) * quantity,
      });

      if (!enrollments) {
        return res.status(400).json({ error: 'No enrollments found.' });
      }
      return res.json(enrollments);
    } catch (err) {
      return res.status(400).json({ error: 'No enrollments found.' });
    }
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { student_id, plan_id, start_date } = req.body;

    // Check if this student already has an enrollment
    const enrollmentExists = await Enrollment.findOne({
      where: { student_id },
    });

    if (enrollmentExists) {
      return res.status(401).json({
        error: 'A enrollment with this student already exists.',
      });
    }

    // Calculate the full price and end date
    const plan = await Plan.findByPk(plan_id);

    const { price } = plan;
    const end_date = addMonths(parseISO(start_date), plan.duration);

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(enrollment);
  }
}
export default new EnrollmentController();
