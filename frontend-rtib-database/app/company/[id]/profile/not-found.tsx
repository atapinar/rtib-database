import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CompanyNotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">Company Not Found</h2>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          The company profile you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild className="mt-6 rounded-full">
          <Link href="/">Return to Homepage</Link>
        </Button>
      </div>
    </div>
  )
}

