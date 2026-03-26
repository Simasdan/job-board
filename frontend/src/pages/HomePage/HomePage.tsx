import { useState, useEffect } from 'react'
import { type JobPost, type PagedResult, type JobPostQuery } from '@/types/JobPost'
import FilterPanel from '@/components/FilterPanel/FilterPanel'
import JobPostCard from '@/components/JobPostCard/JobPostCard'
import Pagination from '@/components/Pagination/Pagination'
import { Spinner } from '@/components/ui/spinner'
import axiosInstance from '@/api/axiosInstance'
import styles from './HomePage.module.scss'
import { useAuth } from '@/context/AuthContext'
import HowItWorks from '@/components/HowItWorks/HowItWorks'

const HomePage = () => {
  const [jobPosts, setJobPosts] = useState<PagedResult<JobPost> | null>(null)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState<JobPostQuery>({
    page: 1,
    pageSize: 5
  })
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    fetchJobPosts(query)
  }, [query])

  const fetchJobPosts = async (q: JobPostQuery) => {
    try {
      setLoading(true)
      const response = await axiosInstance.get('/jobposts', { params: q })
      setJobPosts(response.data)
    } catch {
      console.error('Failed to fetch job posts')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (newQuery: JobPostQuery) => {
    setQuery({ ...query, ...newQuery, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setQuery({ ...query, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <h1>Find your dream job</h1>
        <p>{jobPosts?.totalCount ?? 0} positions available across top companies</p>
      </div>

      <FilterPanel onSearch={handleSearch} />

      <div className={styles.content}>
        {loading ? (
          <div className={styles.loading}>
            <Spinner className={styles.spinner} />
            <span>Loading jobs...</span>
          </div>
        ) : jobPosts?.items.length === 0 ? (
          <div className={styles.empty}>No jobs found matching your criteria.</div>
        ) : (
          <>
            <div className={styles.jobList}>
              {jobPosts?.items.map((jobPost) => (
                <JobPostCard key={jobPost.id} jobPost={jobPost} />
              ))}
            </div>
            <Pagination
              currentPage={jobPosts?.currentPage ?? 1}
              totalPages={jobPosts?.totalPages ?? 1}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      {!isAuthenticated && <HowItWorks />}
    </div>
  )
}

export default HomePage