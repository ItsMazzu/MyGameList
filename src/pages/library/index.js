import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../../styles/pages/library/Library.module.scss'

// Componente para exibir uma única linha na biblioteca
const LibraryRow = ({ game }) => {
    // Formatação de datas
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    // Determina a cor com base no status
    const getStatusClass = (status) => {
        switch(status) {
            case 'Concluído': return styles.statusCompleted;
            case 'Jogando': return styles.statusPlaying;
            case 'Abandonado': return styles.statusDropped;
            case 'Pausado': return styles.statusPaused;
            default: return styles.statusPlanned;
        }
    };
    
    // Simulação da URL da capa (você deve usar game.game_cover do DB)
    const mockCover = game.game_cover || `https://placehold.co/80x100/3f51b5/ffffff?text=${game.game_title.substring(0, 3)}`;

    return (
        <div className={styles.libraryRow}>
            <div className={styles.gameInfo}>
                <img src={mockCover} alt={game.game_title} className={styles.gameCover} />
                <span className={styles.gameTitle}>{game.game_title}</span>
            </div>
            <span className={`${styles.statusBadge} ${getStatusClass(game.status)}`}>{game.status}</span>
            <span className={styles.dataPoint}>{game.platform || 'N/A'}</span>
            <span className={styles.dataPoint}>{game.rating || '-'} / 10</span>
            <span className={styles.dataPoint}>{game.hours_played ? `${game.hours_played}h` : '-'}</span>
            <span className={styles.dataPoint}>{formatDate(game.start_date)}</span>
            <span className={styles.dataPoint}>{formatDate(game.completion_date)}</span>
        </div>
    );
};


const LibraryPage = () => {
    const [library, setLibrary] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('Todos');

    // Função para buscar a biblioteca do usuário na API
    useEffect(() => {
        const fetchLibrary = async () => {
            try {
                const response = await fetch('/api/user_library');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Falha ao carregar a biblioteca.');
                }
                
                setLibrary(data.data);
                
            } catch (err) {
                console.error('Erro ao buscar biblioteca:', err);
                setError('Não foi possível carregar sua biblioteca. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchLibrary();
    }, []);
    
    // Filtragem local dos jogos
    const filteredLibrary = library.filter(game => {
        if (filterStatus === 'Todos') return true;
        return game.status === filterStatus;
    });
    
    // Status disponíveis para filtros
    const availableStatuses = ['Todos', 'Jogando', 'Concluído', 'Planejado', 'Pausado', 'Abandonado'];
    
    // Mensagens condicionais
    if (isLoading) {
        return <div className={styles.loadingContainer}>Carregando sua biblioteca...</div>;
    }
    
    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }
    
    return (
        <>
            <Head>
                <title>Minha Biblioteca | MyGameList</title>
            </Head>

            <div className={styles.libraryPage}>
                <h1 className={styles.pageTitle}>Sua Biblioteca de Jogos</h1>
                <p className={styles.subtitle}>Gerencie o status e o progresso dos seus jogos.</p>

                {/* Filtros de Status (Inspirado no GamePass/Steam Library) */}
                <div className={styles.filterBar}>
                    {availableStatuses.map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`${styles.filterButton} ${filterStatus === status ? styles.active : ''}`}
                        >
                            {status} ({library.filter(g => status === 'Todos' || g.status === status).length})
                        </button>
                    ))}
                </div>

                {/* Cabeçalho da Lista/Tabela */}
                <div className={styles.listHeader}>
                    <span className={styles.headerInfo}>Jogo</span>
                    <span className={styles.headerStatus}>Status</span>
                    <span className={styles.headerData}>Plataforma</span>
                    <span className={styles.headerData}>Avaliação</span>
                    <span className={styles.headerData}>Horas</span>
                    <span className={styles.headerData}>Início</span>
                    <span className={styles.headerData}>Fim</span>
                </div>

                {/* Corpo da Lista */}
                <div className={styles.listBody}>
                    {filteredLibrary.length > 0 ? (
                        filteredLibrary.map(game => (
                            <LibraryRow key={game.game_id} game={game} />
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            Nenhum jogo encontrado com o status "{filterStatus}".
                            {filterStatus !== 'Todos' && (
                                <button className={styles.backButton} onClick={() => setFilterStatus('Todos')}>Ver Todos</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default LibraryPage;