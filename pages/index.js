import Container from "../components/Layout/Container";
import Title from "../components/IO/Title";
import Typography from "../components/IO/Typography";
import Button from "../components/IO/Button";
import { useRouter } from "next/dist/client/router";

export default function Home() {
  const router = useRouter();
  return (
    <Container style="py-32 flex flex-col items-center">
      <main className="my-auto px-10 sm:px-20 w-screen">
        <div className="flex flex-wrap">
          <div className="w-full md:w-2/3 md:px-20">
            <h1 className="text-5xl tracking-tight md:tracking-normal mb-12 md:mb-0 md:text-5xl lg:text-9xl my-auto">
              Art Marketplace for Africa
            </h1>
          </div>
          <div className="w-full md:w-1/3">
            <div className="md:w-72 mb-4">
              <Title style="mb-2">Now moving to Phase 2 😎</Title>
              <Typography style="mb-2" sub>
                Create a digital collecible! Start minting
              </Typography>
              <p className="text-sm text-gray-500"></p>

              <Button
                block
                size="large"
                style="mt-4"
                onClick={() => router.push("/create")}
              >
                Create NFT
              </Button>
            </div>
          </div>
        </div>
      </main>
    </Container>
  );
}
