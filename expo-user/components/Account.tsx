import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { Session } from '@supabase/supabase-js';
import { FlashList } from "@shopify/flash-list";

export default function Account({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [website, setWebsite] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [users, setUsers] = useState<{id: string}[]>([]);

  useEffect(() => {
    if (session) {
      getProfile();
      getAllUsers();
    }
  }, [session]);

  async function getAllUsers() {
    try {
      const { data, error } = await supabase.from('profiles').select('id');
      if (error) throw error;
      setUsers(data ?? []);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ username, website, avatar_url }: { username: string; website: string; avatar_url: string }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error('No user on the session!');

      const updates = {
        id: session?.user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from('profiles').upsert(updates);
      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Nome de usuário" value={username || ''} onChangeText={(text) => setUsername(text)} />
      </View>
      <View style={styles.verticallySpaced}>
        <Input label="Website" value={website || ''} onChangeText={(text) => setWebsite(text)} />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Carregando ...' : 'Cadastrar'}
          onPress={() => updateProfile({ username, website, avatar_url: avatarUrl })}
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sair" onPress={() => supabase.auth.signOut()} />
      </View>
      
      <View style={[styles.verticallySpaced, { height:200 }]}>
        <FlashList
         data={users}
         renderItem={({ item }) => <Text>{item.id}</Text>}
         estimatedItemSize={200}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
});
