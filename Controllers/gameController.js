const Game = require("../Models/Game"); // Assuming you have a Game model
const UserGame = require("../Models/userGame")
const mongoose = require("mongoose");

// Create a new game (Admin)
// const createGame = async (req, res) => {
//   try {
//     const { name, description, startTime, endTime } = req.body;
//     const newGame = await Game.create({ name, description, startTime, endTime });
//     res.status(201).json({ success: true, data: newGame });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

const createGame = async (req, res) => {
  try {
    const { name, description, startTime, endTime } = req.body;

    // Helper function to convert hh:mm:ss A format to ISO string
    const convertToISO = (timeString) => {
      const [time, modifier] = timeString.split(" ");
      let [hours, minutes, seconds] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      const now = new Date(); // Use today's date
      now.setHours(hours, minutes, seconds, 0);
      return now.toISOString();
    };

    // Convert startTime and endTime to ISO format
    const startISO = convertToISO(startTime);
    const endISO = convertToISO(endTime);

    // Create the game
    const newGame = await Game.create({
      name,
      description,
      startTime: startISO,
      endTime: endISO,
    });

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



const addUserGame = async (req, res) => {
  console.log("addUserGame", req.body);
  const { userId, gameId, gameType, name, description, betAmount } = req.body;

  try {
    // Log the userId to ensure it's correct
    console.log("userId format: ", userId);

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }
    if (!mongoose.Types.ObjectId.isValid(gameId)) {
      return res.status(400).json({ message: "Invalid gameId format" });
    }

    // Convert to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const gameObjectId = new mongoose.Types.ObjectId(gameId);

    // Log the converted ObjectId values
    console.log("Converted userId: ", userObjectId);
    console.log("Converted gameId: ", gameObjectId);

    // Check if the game exists
    const game = await Game.findById(gameObjectId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    // Find the user game record or create a new one
    let userGame = await UserGame.findOne({ userId: userObjectId });

    if (userGame) {
      // If user game exists, push the new game to the user's games array
      userGame.games.push({
        gameId: gameObjectId,
        gameType,
        name,
        description,
        betAmount,
      });
      userGame.totalBetAmount += betAmount;
      await userGame.save();
    } else {
      // If no user game record exists, create a new one
      const newUserGame = new UserGame({
        userId: userObjectId,
        games: [
          {
            gameId: gameObjectId,
            gameType,
            name,
            description,
            betAmount,
          },
        ],
        totalBetAmount: betAmount,
      });
      await newUserGame.save();
    }

    res.status(200).json({ message: "User game added successfully" });
  } catch (error) {
    console.error("Error adding user game: ", error); // Added logging for debugging
    res.status(500).json({ message: "Error adding user game", error: error.message });
  }
};





const getUserGame = async (req, res) => {
  const { userId } = req.body;

  try {
    // Find the user game record
    const userGame = await UserGame.findOne({ userId }).populate('games.gameId'); // Populate game details

    if (!userGame) {
      return res.status(404).json({ message: "User game not found" });
    }

    res.status(200).json({ success: true, data: userGame.games });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user games", error: error.message });
  }
}




module.exports = {
  createGame,
  editGame,
  deleteGame,
  getGames,
  getGameById,
  playGame,
  addUserGame ,
  getUserGame 
};
