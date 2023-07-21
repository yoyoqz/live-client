import {
  type GetServerSideProps,
  type InferGetServerSidePropsType,
} from "next";

import { useEffect, useState } from 'react';

import ChannelInfo from "@/components/channel/ChannelInfo";
import Chat from "@/components/channel/Chat";
import Sidebar from "@/components/channel/Sidebar";
import StreamPlayer from "@/components/channel/StreamPlayer";
import WatchingAsBar from "@/components/channel/WatchingAsBar";

import { LiveKitRoom } from "@livekit/components-react";

interface Props {
  slug: string;
}
interface TokenResult {
  url: string;
  token: string;
}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  params,
}) => {
  return Promise.resolve({
    props: {
      slug: params?.slug as string,
    },
  });
};

export default function ChannelPage({
  slug,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  
  //const [viewerName, setViewerName] = useState("");
  const [tokenResult, setTokenResult] = useState<TokenResult | undefined>();
  //const [region, setRegion] = useState("");
  const viewerName = randomString(4);
  //setTokenResult(new TokenResult())

/*  
  const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
  const generatedName = useMemo(() => generateName(), []);

  const [viewerName, setViewerName] = useState("");
  const [viewerToken, setViewerToken] = useState("");
  const [queryEnabled, setQueryEnabled] = useState(false);

  api.token.get.useQuery(
    {
      roomName: slug,
      identity: generatedName,
    },
    {
      onSuccess: (data) => {
        const payload: JwtPayload = jwt(data?.token);

        if (payload.jti) {
          setViewerName(payload.jti);
        }

        setViewerToken(data?.token);
        sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, data?.token);
      },
      enabled: queryEnabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  );

  // NOTE: This is a hack to persist the viewer token in the session storage
  // so that the client doesn't have to create a viewer token every time they
  // navigate back to the page.
  useEffect(() => {
    const sessionToken = sessionStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

    if (sessionToken) {
      const payload: JwtPayload = jwt(sessionToken);

      if (payload.exp) {
        const expiry = new Date(payload.exp * 1000);
        if (expiry < new Date()) {
          sessionStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);
          setQueryEnabled(true);
          return;
        }
      }

      if (payload.jti) {
        setViewerName(payload.jti);
      }

      setViewerToken(sessionToken);
    } else {
      setQueryEnabled(true);
    }
  }, [SESSION_VIEWER_TOKEN_KEY]);

  if (viewerToken === "" || viewerName === "") {
    return null;
  }
*/

  //const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
  //  stageLayout: 'grid',
  //});
//const router = useRouter();
  //const toast = useToast();

/*
useEffect(() => {
  // cleanup
  return () => {
    audioTrack?.stop();
    videoTrack?.stop();
  };
}, []);

const onLeave = () => {
  router.push('/');
};
*/

/*
  room.on(RoomEvent.Disconnected, (reason) => {
    toast({
      title: 'Disconnected',
      description: `You've been disconnected from the room`,
      duration: 4000,
      onCloseComplete: () => {
      },
    });
  });
*/

  useEffect(() => {
    const roomName = slug
    const identity = viewerName
    const params: { [key: string]: string } = {
      roomName,
      identity,
    };
    //if (region) {
    //  params.region = region;
    //}
    fetch("/live/api/token?" + new URLSearchParams(params).toString())
      .then((res) => res.json())
      .then((data: TokenResult) => {
        setTokenResult(data);
      }).catch(e => {
        console.log(e)
      });
  }, [slug]);

  return (
    <div className = "lk-room-container">
      {tokenResult &&       
        <LiveKitRoom
          serverUrl = {tokenResult.url}
          token={tokenResult.token}        
        >

      <WatchingAsBar viewerName={viewerName} />
      <div className="flex h-full flex-1">
        <div className="sticky hidden w-80 border-r dark:border-zinc-800 dark:bg-zinc-900 lg:block">
          <div className="absolute left-0 top-0 bottom-0 flex h-full w-full flex-col gap-2 px-4 py-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex-1 flex-col dark:border-t-zinc-200 dark:bg-black">
          <StreamPlayer />
          <ChannelInfo username={slug} />
        </div>
        <div className="sticky hidden w-80 border-l dark:border-zinc-800 dark:bg-zinc-900 md:block">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            <Chat viewerName={viewerName} />
          </div>
        </div>
      </div>
      </LiveKitRoom>}
    </div>
    /*
    <RoomProvider
      token={viewerToken}
      serverUrl={env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className="flex flex-1 flex-col"
    >
      <WatchingAsBar viewerName={viewerName} />
      <div className="flex h-full flex-1">
        <div className="sticky hidden w-80 border-r dark:border-zinc-800 dark:bg-zinc-900 lg:block">
          <div className="absolute left-0 top-0 bottom-0 flex h-full w-full flex-col gap-2 px-4 py-2">
            <Sidebar />
          </div>
        </div>
        <div className="flex-1 flex-col dark:border-t-zinc-200 dark:bg-black">
          <StreamPlayer />
          <ChannelInfo username={slug} />
        </div>
        <div className="sticky hidden w-80 border-l dark:border-zinc-800 dark:bg-zinc-900 md:block">
          <div className="absolute top-0 bottom-0 right-0 flex h-full w-full flex-col gap-2 p-2">
            <Chat viewerName={viewerName} />
          </div>
        </div>
      </div>
    </RoomProvider>
    */
  );
}

function randomString(length: number): string {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
