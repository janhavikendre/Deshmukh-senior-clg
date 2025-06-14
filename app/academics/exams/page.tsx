import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, Bell } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import clientPromise from "@/lib/mongodb"
import Image from "next/image"

async function getExamData() {
  try {
    const client = await clientPromise
    const db = client.db("fashion_institute")

    const examInfo = await db.collection("content").findOne({ section: "exams" })
    const schedules = await db.collection("exam_schedules").find({}).sort({ createdAt: -1 }).toArray()
    const results = await db.collection("exam_results").find({}).sort({ createdAt: -1 }).toArray()

    return {
      examInfo: examInfo?.examInfo || "",
      schedules: JSON.parse(JSON.stringify(schedules || [])),
      results: JSON.parse(JSON.stringify(results || [])),
    }
  } catch (error) {
    console.error("Error fetching exam data:", error)
    return {
      examInfo: "",
      schedules: [],
      results: [],
    }
  }
}

function SectionHero({ title, bgImage }: { title: string; bgImage?: string }) {
  return (
    <div className="relative w-full h-56 md:h-56 flex items-center justify-center overflow-hidden mb-10">
      {bgImage && (
        <Image
          src={bgImage}
          alt={title}
          fill
          className="object-cover"
          style={{ zIndex: 0 }}
        />
      )}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/70 via-teal-600/60 to-purple-400/40" />
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-400/30 rounded-full blur-2xl" />
        <div className="absolute top-10 right-0 w-40 h-40 bg-teal-300/30 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-white/10 rounded-full blur-3xl" />
        <svg className="absolute bottom-0 left-0 w-full" height="40" viewBox="0 0 100 10" preserveAspectRatio="none">
          <polygon points="0,10 100,0 100,10" fill="#F7F9FC" />
        </svg>
      </div>
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center drop-shadow-lg py-8">
          {title}
        </h1>
      </div>
    </div>
  )
}

export default async function ExamsPage() {
  const { examInfo, schedules, results } = await getExamData()

  return (
    <>
      <SectionHero title="Examinations" bgImage="/header.webp" />
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-center mb-12">Examinations</h1>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Exam Information</TabsTrigger>
            <TabsTrigger value="schedules">Exam Schedules</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-800">Examination Guidelines</h2>

                {examInfo ? (
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: examInfo }} />
                ) : (
                  <>
                    <p className="text-gray-700 mb-4">
                      The Deshmukh College Of Pharmacy conducts examinations to evaluate students'
                      understanding and application of concepts taught during the academic term. These examinations are
                      designed to assess theoretical knowledge as well as practical skills.
                    </p>

                    <h3 className="text-xl font-bold mb-3 mt-6 text-purple-800">Examination Pattern</h3>
                    <p className="text-gray-700 mb-4">
                      Each course has both internal and external assessments. Internal assessments include class
                      assignments, projects, presentations, and mid-term tests. External assessments are conducted at the
                      end of each semester.
                    </p>

                    <h3 className="text-xl font-bold mb-3 mt-6 text-purple-800">Evaluation Criteria</h3>
                    <p className="text-gray-700 mb-4">Students are evaluated based on the following criteria:</p>
                    <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                      <li>Theory examinations - 40%</li>
                      <li>Practical assessments - 40%</li>
                      <li>Assignments and projects - 10%</li>
                      <li>Attendance and participation - 10%</li>
                    </ul>

                    <h3 className="text-xl font-bold mb-3 mt-6 text-purple-800">Passing Criteria</h3>
                    <p className="text-gray-700 mb-4">
                      Students must score a minimum of 40% marks in each subject and 50% marks in aggregate to pass the
                      semester examination.
                    </p>
                  </>
                )}

                <div className="bg-purple-50 p-4 rounded-lg mt-8">
                  <div className="flex items-center mb-2">
                    <Bell className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-purple-800">Important Notes</h4>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    <li>Students must carry their ID cards to the examination hall.</li>
                    <li>Use of mobile phones or any electronic devices is strictly prohibited during examinations.</li>
                    <li>Students found using unfair means will be subject to disciplinary action.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedules" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-800">Examination Schedules</h2>

                {schedules && schedules.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schedules.map((schedule:any) => (
                      <Card key={schedule._id} className="hover:shadow-lg transition-shadow border-rose-100">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                          <Calendar className="h-10 w-10 text-purple-600 mb-3" />
                          <h3 className="font-semibold mb-2 text-purple-800">{schedule.title}</h3>
                          <p className="text-sm text-gray-500 mb-6">
                            Added on {new Date(schedule.createdAt).toLocaleDateString()}
                          </p>
                          <Button asChild className="mt-auto  bg-purple-600:bg-purple-700">
                            <a href={`/api/files/${schedule.fileId}`} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" /> Download Schedule
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Examination Schedules Available</h3>
                    <p className="text-gray-500">
                      Examination schedules will be uploaded here when available. Please check back later.
                    </p>
                  </div>
                )}

                <div className="mt-8 p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Contact Information</h3>
                  <p className="text-gray-700">
                    For any queries regarding examination schedules, please contact the Examination Cell:
                  </p>
                  <p className="text-gray-700 mt-2">
                    <span className="font-medium">Email:</span> exam@nifd.edu
                    <br />
                    <span className="font-medium">Phone:</span> +91 9975469123

                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-purple-800">Examination Results</h2>

                {results && results.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((result:any) => (
                      <Card key={result._id} className="hover:shadow-lg transition-shadow border-rose-100">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                          <FileText className="h-10 w-10 text-purple-600 mb-3" />
                          <h3 className="font-semibold mb-2 text-purple-800">{result.title}</h3>
                          <p className="text-sm text-gray-500 mb-6">
                            Published on {new Date(result.createdAt).toLocaleDateString()}
                          </p>
                          <Button asChild className="mt-auto  bg-purple-600:bg-purple-700">
                            <a href={`/api/files/${result.fileId}`} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" /> Download Result
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-600 mb-2">No Results Available</h3>
                    <p className="text-gray-500">
                      Examination results will be uploaded here when available. Please check back later.
                    </p>
                  </div>
                )}

                <div className="mt-8 bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-2">Result Verification</h3>
                  <p className="text-gray-700 mb-3">
                    If you need to verify your results or have any discrepancies, please visit the Examination Cell with
                    your ID card and examination hall ticket within 7 days of result declaration.
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Re-evaluation Request:</span> Applications for re-evaluation must be
                    submitted within 10 days of result declaration along with the prescribed fee.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
