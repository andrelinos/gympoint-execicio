import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { page = 1, quantity = 20 } = req.query;

    const { rows: students } = await Student.findAndCountAll({
      limit: quantity,
      offset: (page - 1) * quantity,
    });

    return res.json(students);
  }

  async show(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    return res.json(student);
  }

  async store(req, res) {
    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }
    const { id, name, email, weight, height, birthday } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      weight,
      height,
      birthday,
    });
  }

  async update(req, res) {
    const { email } = req.body;

    const student = await Student.findByPk(req.studentId);

    if (email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email },
      });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const { id, name, weight, height, birthday } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      weight,
      height,
      birthday,
    });
  }
}
export default new StudentController();
