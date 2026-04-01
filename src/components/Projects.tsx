import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import { ExternalLink, Github } from "lucide-react";
import { projects } from "../data";

export function Projects() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="py-4 shadow-sm hover:shadow-lg transition-shadow border border-default-100"
        >
          <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
            <h4 className="font-bold text-large">{project.title}</h4>
            <p className="text-default-500">{project.description}</p>
          </CardHeader>
          <CardBody className="overflow-visible py-2">
            <div className="flex flex-wrap gap-2 mt-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </CardBody>
          <CardFooter className="flex justify-between mt-auto">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 pr-1"
            >
              <Button
                color="primary"
                variant="solid"
                className="w-full flex items-center gap-2"
              >
                <ExternalLink size={16} />
                Live
              </Button>
            </a>

            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-1/2 pl-1"
            >
              <Button
                color="default"
                variant="bordered"
                className="w-full flex items-center gap-2"
              >
                <Github size={16} />
                Code
              </Button>
            </a>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
