import { useState } from 'react'
import type { JobPostQuery } from '@/types/JobPost'
import styles from './FilterPanel.module.scss'
import SearchIcon from '@/assets/icons/search.svg?react'

interface FilterPanelProps {
    onSearch: (query: JobPostQuery) => void
}

const FilterPanel = ({ onSearch }: FilterPanelProps) => {
    const [title, setTitle] = useState('')
    const [location, setLocation] = useState('')
    const [salaryMin, setSalaryMin] = useState('')
    const [salaryMax, setSalaryMax] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState('desc')

    const handleSearch = () => {
        onSearch({
            title: title || undefined,
            location: location || undefined,
            salaryMin: salaryMin ? Number(salaryMin) : undefined,
            salaryMax: salaryMax ? Number(salaryMax) : undefined,
            sortBy,
            sortOrder,
            page: 1
        })
    }

    const handleReset = () => {
        setTitle('')
        setLocation('')
        setSalaryMin('')
        setSalaryMax('')
        setSortBy('createdAt')
        setSortOrder('desc')
        onSearch({ page: 1 })
    }

    const handleSortChange = (newSortBy: string, newSortOrder: string) => {
        setSortBy(newSortBy)
        setSortOrder(newSortOrder)
        onSearch({
            title: title || undefined,
            location: location || undefined,
            salaryMin: salaryMin ? Number(salaryMin) : undefined,
            salaryMax: salaryMax ? Number(salaryMax) : undefined,
            sortBy: newSortBy,
            sortOrder: newSortOrder,
            page: 1
        })
    }

    const sortOptions = [
        { label: 'Newest', sortBy: 'createdAt', sortOrder: 'desc' },
        { label: 'Oldest', sortBy: 'createdAt', sortOrder: 'asc' },
        { label: 'Salary ↑', sortBy: 'salary', sortOrder: 'asc' },
        { label: 'Salary ↓', sortBy: 'salary', sortOrder: 'desc' },
    ]

    return (
        <div className={styles.filterPanel}>
            <div className={styles.searchRow}>
                <div className={styles.inputs}>
                    <div className={styles.inputWrapper}>
                        <label>What job are you looking for?</label>
                        <div className={styles.inputWithIcon}>
                            <SearchIcon />
                            <input
                                type='text'
                                placeholder='e.g. Senior Developer'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Location</label>
                        <input
                            type='text'
                            placeholder='e.g. Vilnius'
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Min salary</label>
                        <input
                            type='number'
                            placeholder='0'
                            value={salaryMin}
                            onChange={(e) => setSalaryMin(e.target.value)}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label>Max salary</label>
                        <input
                            type='number'
                            placeholder='Any'
                            value={salaryMax}
                            onChange={(e) => setSalaryMax(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.buttonGroup}>
                    <button className={styles.searchButton} onClick={handleSearch}>
                        Search
                    </button>
                    <button className={styles.resetButton} onClick={handleReset}>
                        Reset
                    </button>
                </div>
            </div>

            <div className={styles.divider} />

            <div className={styles.sortRow}>
                <span className={styles.sortLabel}>Sort by</span>

                <div className={styles.sortPills}>
                    {sortOptions.map((option) => (
                        <button
                            key={option.label}
                            className={
                                sortBy === option.sortBy && sortOrder === option.sortOrder
                                    ? `${styles.sortPill} ${styles.activePill}`
                                    : styles.sortPill
                            }
                            onClick={() => handleSortChange(option.sortBy, option.sortOrder)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <select
                    className={styles.sortSelect}
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                        const [newSortBy, newSortOrder] = e.target.value.split('-')
                        handleSortChange(newSortBy, newSortOrder)
                    }}
                >
                    {sortOptions.map((option) => (
                        <option key={option.label} value={`${option.sortBy}-${option.sortOrder}`}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default FilterPanel