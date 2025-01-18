const Game = require("../Models/Game"); // Assuming you have a Game model

// Create a new game (Admin)
const createGame = async (req, res) => {
  try {
    const { name, description, startTime, endTime } = req.body;
    const newGame = await Game.create({ name, description, startTime, endTime });
    res.status(201).json({ success: true, data: newGame });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Edit a game (Admin)
const editGame = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGame = await Game.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedGame) return res.status(404).json({ success: false, message: "Game not found" });
    res.status(200).json({ success: true, data: updatedGame });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a game (Admin)
const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGame = await Game.findByIdAndDelete(id);
    if (!deletedGame) return res.status(404).json({ success: false, message: "Game not found" });
    res.status(200).json({ success: true, message: "Game deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all games (User)
const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ success: true, data: games });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a game by ID (User)
const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });
    res.status(200).json({ success: true, data: game });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Play a game (User)
const playGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, betAmount } = req.body;

    // Simulate game logic (add user bet, calculate result, etc.)
    const game = await Game.findById(id);
    if (!game) return res.status(404).json({ success: false, message: "Game not found" });

    // Example: Update game with user's participation
    game.participants.push({ userId, betAmount });
    await game.save();

    res.status(200).json({ success: true, message: "Game played successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createGame,
  editGame,
  deleteGame,
  getGames,
  getGameById,
  playGame,
};
