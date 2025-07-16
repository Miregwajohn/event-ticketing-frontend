import { Link, useRouteError } from "react-router-dom";
import {ArrowLeft} from "lucide-react"

export const Error = () => {
    const error:any=useRouteError()
  return (
    <div className="py-19 bg-base-200">
        <div className="text-center">
        <p className="text-base font-bold text-red-600">404</p>
        <h1 className="mt-3 text-3xl font-bold text-green-400 sm:text-5xl">Page Not Found</h1>
         <p className="mt-4 text-base loading-7 text-amber-400">Sorry, we could not find the page your are looking for</p> 
         <p>
            {error?.statusText || error.message}
         </p>
         <div className="mt-4 flex items-center justify-center gap-x-3">
            <Link to="/" className="inline-flex items-center btn btn-sm btn-info text-sm font-semibold"><ArrowLeft size={18} className="mr-3" />Go back
            </Link>
            <Link to="/contact" className="rounded-md btn btn-primary btn-sm  text-sm font-semibold"> Contact us
            </Link>
        </div>
        </div>
                </div>
  )
}
