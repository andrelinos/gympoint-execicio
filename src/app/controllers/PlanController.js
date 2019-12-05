import Plan from '../models/Plan';

// import UserControler from './UserControler';

class PlanController {
  async index(req, res) {
    const { page = 1, quantity = 20 } = req.query;

    const { rows: plans } = await Plan.findAndCountAll({
      limit: quantity,
      offset: (page - 1) * quantity,
    });

    return res.json(plans);
  }

  async store(req, res) {
    const planExists = await Plan.findOne({
      where: { title: req.body.title },
    });

    if (planExists) {
      return res.status(400).json({ error: 'Plan already exists.' });
    }
    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }

  async update(req, res) {
    const { title } = req.body;

    const plan = await Plan.findByPk(req.planId);

    if (plan !== plan.title) {
      const planExists = await Plan.findOne({
        where: { plan },
      });

      if (planExists) {
        return res.status(400).json({ error: 'Plan already exists.' });
      }
    }

    const { id, duration, price } = await plan.update(req.body);

    return res.json({
      id,
      title,
      duration,
      price,
    });
  }
}
export default new PlanController();
