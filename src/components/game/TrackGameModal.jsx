import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "../../styles/TrackGameModal.module.scss";

// Dados de Status para os dropdowns
const GAME_STATUSES = [
  { value: "want_to_play", label: "Quero Jogar" },
  { value: "playing", label: "Jogando" },
  { value: "completed", label: "Completo" },
  { value: "on_hold", label: "Em Espera" },
  { value: "dropped", label: "Abandonado" },
];

// 🔥 NOVAS PLATAFORMAS REAIS DO BANCO
const PLATFORMS = [
  "PC",
  "PS5",
  "Xbox Series X",
  "Switch",
  "Android",
  "iOS",
  "Outra",
];

const TrackGameModal = ({ game, onClose, onTrackSuccess }) => {
  const { user } = useAuth();

  const [status, setStatus] = useState("want_to_play");
  const [rating, setRating] = useState(null);
  const [hoursPlayed, setHoursPlayed] = useState(0);
  const [platform, setPlatform] = useState("");
  const [startDate, setStartDate] = useState("");
  const [completionDate, setCompletionDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    const payload = {
      user_id: user.id,
      game_id: game.id,
      status,
      rating: rating ? parseFloat(rating) : null,
      hours_played: parseInt(hoursPlayed) || 0,
      platform: platform || null,
      start_date: startDate || null,
      completion_date: completionDate || null,
    };

    try {
      const response = await fetch("/api/games/user_games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao registrar o jogo.");
      }

      onTrackSuccess(data.operation);
      onClose();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 className={styles.title}>Adicionar "{game.title}" à sua Lista</h2>

        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Status */}
          <div className={styles.formGroup}>
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              {GAME_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Plataforma */}
          <div className={styles.formGroup}>
            <label htmlFor="platform">Plataforma</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              <option value="">Selecione a Plataforma</option>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Horas jogadas */}
          <div className={styles.formGroup}>
            <label htmlFor="hoursPlayed">Horas Jogadas</label>
            <input
              id="hoursPlayed"
              type="number"
              value={hoursPlayed || ""}
              onChange={(e) => setHoursPlayed(e.target.value)}
              min="0"
            />
          </div>

          {/* Nota */}
          <div className={styles.formGroup}>
            <label htmlFor="rating">Sua Nota (0.0 a 5.0)</label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating || ""}
              onChange={(e) => setRating(e.target.value)}
            />
          </div>

          {/* Datas */}
          <div className={styles.dateGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Data de Início</label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="completionDate">Data de Conclusão</label>
              <input
                id="completionDate"
                type="date"
                value={completionDate}
                onChange={(e) => setCompletionDate(e.target.value)}
                disabled={status !== "completed"}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Salvando..." : "Salvar na Minha Lista"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrackGameModal;
