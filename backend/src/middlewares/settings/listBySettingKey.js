const mongoose = require('mongoose');

// Define e registra o schema diretamente aqui
const settingSchema = new mongoose.Schema({
  settingKey: { type: String, required: true, unique: true },
  settingValue: { type: mongoose.Schema.Types.Mixed, required: true },
  removed: { type: Boolean, default: false },
});

// Faz o registro ou recupera se já existir
const Model = mongoose.models.Setting || mongoose.model('Setting', settingSchema);

const listBySettingKey = async ({ settingKeyArray = [] }) => {
  try {
    if (settingKeyArray.length === 0) {
      return [];
    }

    const query = {
      settingKey: { $in: settingKeyArray },
      removed: false,
    };

    const results = await Model.find(query);

    return results.length >= 1 ? results : [];
  } catch (error) {
    console.error('Erro ao buscar settings:', error);
    return [];
  }
};

module.exports = listBySettingKey;
